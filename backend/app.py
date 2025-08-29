from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime, date
import os
import io
import pandas as pd
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend import models
from backend.services.risk import compute_risk_level, ensure_default_settings
from backend.services.reports import build_weekly_reports
from backend.services.alerts import send_alerts
from apscheduler.schedulers.background import BackgroundScheduler

ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def create_app():
    app = Flask(__name__)
    CORS(app)
    Base.metadata.create_all(bind=engine)

    # Scheduler for weekly reports/alerts (Sunday 6am)
    scheduler = BackgroundScheduler()
    @scheduler.scheduled_job("cron", day_of_week="sun", hour=6, minute=0)
    def weekly_job():
        with SessionLocal() as db:
            ensure_default_settings(db)
            reports = build_weekly_reports(db)
            send_alerts(db, reports)
    scheduler.start()

    @app.route("/api/health")
    def health():
        return {"ok": True, "time": datetime.utcnow().isoformat()}

    @app.route("/api/settings", methods=["GET", "PUT"])
    def settings():
        with SessionLocal() as db:
            s = ensure_default_settings(db)
            if request.method == "PUT":
                data = request.get_json()
                s.attendance_low = data.get("attendance_low", s.attendance_low)
                s.attendance_medium = data.get("attendance_medium", s.attendance_medium)
                s.score_low = data.get("score_low", s.score_low)
                s.score_medium = data.get("score_medium", s.score_medium)
                s.fee_days_overdue_medium = data.get("fee_days_overdue_medium", s.fee_days_overdue_medium)
                s.fee_days_overdue_high = data.get("fee_days_overdue_high", s.fee_days_overdue_high)
                db.add(s); db.commit(); db.refresh(s)
            return jsonify({
                "attendance_low": s.attendance_low,
                "attendance_medium": s.attendance_medium,
                "score_low": s.score_low,
                "score_medium": s.score_medium,
                "fee_days_overdue_medium": s.fee_days_overdue_medium,
                "fee_days_overdue_high": s.fee_days_overdue_high,
            })

    @app.route("/api/upload", methods=["POST"])
    def upload():
        files = request.files
        processed = 0
        with SessionLocal() as db:
            ensure_default_settings(db)
            # Attendance
            if "attendance" in files and allowed_file(files["attendance"].filename):
                df = read_any(files["attendance"])
                processed += import_attendance(db, df)
            # Exams
            if "exams" in files and allowed_file(files["exams"].filename):
                df = read_any(files["exams"])
                processed += import_exams(db, df)
            # Fees
            if "fees" in files and allowed_file(files["fees"].filename):
                df = read_any(files["fees"])
                processed += import_fees(db, df)
            # Recompute risk for all students
            recompute_all_risk(db)
        return jsonify({"processed": processed})

    @app.route("/api/classes")
    def classes():
        with SessionLocal() as db:
            rows = db.query(models.Classroom).all()
            return jsonify([{"id": r.id, "name": r.name} for r in rows])

    @app.route("/api/subjects")
    def subjects():
        with SessionLocal() as db:
            rows = db.query(models.Subject).all()
            return jsonify([{"id": r.id, "name": r.name} for r in rows])

    @app.route("/api/students")
    def students():
        class_id = request.args.get("classId", "all")
        risk = request.args.get("risk", "all")
        subject_id = request.args.get("subjectId", "all")

        with SessionLocal() as db:
            q = db.query(models.Student)
            if class_id != "all":
                q = q.filter(models.Student.class_id == class_id)
            students = q.all()

            # Aggregate metrics
            result = []
            for st in students:
                attendance_pct = st.attendance_pct or 0.0
                avg_score = st.avg_score or 0.0
                fee_status = st.fee_status or "ok"
                level = st.risk_level or "low"
                if risk != "all" and level != risk:
                    continue
                # subject filter: include if student has any exam in subject
                if subject_id != "all":
                    has_subject = any(er.subject_id == subject_id for er in st.exam_results)
                    if not has_subject:
                        continue
                result.append({
                    "student_id": st.id,
                    "name": st.name,
                    "class_id": st.class_id,
                    "class_name": st.classroom.name if st.classroom else "",
                    "attendance_pct": attendance_pct,
                    "avg_score": avg_score,
                    "fee_status": fee_status,
                    "risk_level": level,
                })
            return jsonify(result)

    @app.route("/api/metrics/risk-summary")
    def risk_summary():
        class_id = request.args.get("classId", "all")
        subject_id = request.args.get("subjectId", "all")
        with SessionLocal() as db:
            q = db.query(models.Student)
            if class_id != "all":
                q = q.filter(models.Student.class_id == class_id)
            students = q.all()
            total = 0; low=0; med=0; high=0
            for st in students:
                # subject filter
                if subject_id != "all":
                    has_subject = any(er.subject_id == subject_id for er in st.exam_results)
                    if not has_subject:
                        continue
                total += 1
                if st.risk_level == "high": high += 1
                elif st.risk_level == "medium": med += 1
                else: low += 1
            return jsonify({"total": total, "low": low, "medium": med, "high": high})

    @app.route("/api/metrics/attendance-trend")
    def attendance_trend():
        class_id = request.args.get("classId", "all")
        subject_id = request.args.get("subjectId", "all")  # not used for attendance but accepted
        with SessionLocal() as db:
            q = db.query(models.Attendance)
            if class_id != "all":
                q = q.join(models.Student).filter(models.Student.class_id == class_id)
            # Compute daily average attendance %
            by_date = {}
            rows = q.all()
            for r in rows:
                key = r.date.isoformat()
                by_date.setdefault(key, {"present": 0, "total": 0})
                by_date[key]["present"] += 1 if r.present else 0
                by_date[key]["total"] += 1
            data = [{"date": k, "attendance_pct": round(v["present"]/v["total"]*100, 1) if v["total"] else 0} for k, v in sorted(by_date.items())]
            return jsonify(data)

    @app.route("/api/metrics/score-progression")
    def score_prog():
        class_id = request.args.get("classId", "all")
        subject_id = request.args.get("subjectId", "all")
        with SessionLocal() as db:
            q = db.query(models.ExamResult)
            if class_id != "all":
                q = q.join(models.Student).filter(models.Student.class_id == class_id)
            if subject_id != "all":
                q = q.filter(models.ExamResult.subject_id == subject_id)
            by_date = {}
            rows = q.all()
            for r in rows:
                key = r.date.isoformat()
                by_date.setdefault(key, {"sum": 0.0, "count": 0})
                by_date[key]["sum"] += r.score
                by_date[key]["count"] += 1
            data = [{"date": k, "avg_score": round(v["sum"]/v["count"], 1) if v["count"] else 0} for k, v in sorted(by_date.items())]
            return jsonify(data)

    @app.route("/api/metrics/subject-risk")
    def subject_risk():
        class_id = request.args.get("classId", "all")
        with SessionLocal() as db:
            # For each subject, count student max-risk level among their exam results in that subject
            subjects = db.query(models.Subject).all()
            data = []
            for subj in subjects:
                students = db.query(models.Student).join(models.ExamResult).filter(models.ExamResult.subject_id == subj.id)
                if class_id != "all":
                    students = students.filter(models.Student.class_id == class_id)
                low=med=high=0
                for st in students.distinct():
                    lvl = st.risk_level or "low"
                    if lvl == "high": high += 1
                    elif lvl == "medium": med += 1
                    else: low += 1
                data.append({"subject": subj.name, "low": low, "medium": med, "high": high})
            return jsonify(data)

    return app

def read_any(storage_file) -> pd.DataFrame:
    filename = secure_filename(storage_file.filename)
    ext = filename.rsplit(".", 1)[1].lower()
    content = storage_file.read()
    if ext == "csv":
        return pd.read_csv(io.BytesIO(content))
    else:
        return pd.read_excel(io.BytesIO(content))

def import_attendance(db: Session, df: pd.DataFrame) -> int:
    # expected: student_id, date, present (0/1)
    count = 0
    for _, row in df.iterrows():
        st = get_or_create_student(db, str(row["student_id"]))
        att = models.Attendance(student_id=st.id, date=pd.to_datetime(row["date"]).date(), present=bool(int(row["present"])))
        db.add(att); count += 1
    db.commit()
    return count

def import_exams(db: Session, df: pd.DataFrame) -> int:
    # expected: student_id, subject, date, score (0-100)
    count = 0
    for _, row in df.iterrows():
        st = get_or_create_student(db, str(row["student_id"]))
        subj = get_or_create_subject(db, str(row["subject"]))
        er = models.ExamResult(student_id=st.id, subject_id=subj.id, date=pd.to_datetime(row["date"]).date(), score=float(row["score"]))
        db.add(er); count += 1
    db.commit()
    return count

def import_fees(db: Session, df: pd.DataFrame) -> int:
    # expected: student_id, due_date, paid_date, amount_due, amount_paid
    count = 0
    for _, row in df.iterrows():
        st = get_or_create_student(db, str(row["student_id"]))
        fee = models.FeePayment(
            student_id=st.id,
            due_date=pd.to_datetime(row["due_date"]).date() if not pd.isna(row["due_date"]) else None,
            paid_date=pd.to_datetime(row["paid_date"]).date() if not pd.isna(row["paid_date"]) else None,
            amount_due=float(row["amount_due"]),
            amount_paid=float(row["amount_paid"]),
        )
        db.add(fee); count += 1
    db.commit()
    return count

def recompute_all_risk(db: Session):
    settings = ensure_default_settings(db)
    students = db.query(models.Student).all()
    for st in students:
        # attendance %
        total = db.query(models.Attendance).filter_by(student_id=st.id).count()
        present = db.query(models.Attendance).filter_by(student_id=st.id, present=True).count()
        st.attendance_pct = round((present/total)*100, 1) if total else 0.0
        # avg score
        results = db.query(models.ExamResult).filter_by(student_id=st.id).all()
        if results:
            st.avg_score = round(sum(r.score for r in results)/len(results), 1)
        else:
            st.avg_score = 0.0
        # fee status and days overdue
        latest_fee = db.query(models.FeePayment).filter_by(student_id=st.id).order_by(models.FeePayment.due_date.desc()).first()
        fee_status = "ok"
        days_overdue = 0
        if latest_fee and latest_fee.due_date and (latest_fee.amount_due - latest_fee.amount_paid) > 0:
            if latest_fee.paid_date is None or latest_fee.paid_date > latest_fee.due_date:
                delta = (date.today() - latest_fee.due_date).days
                days_overdue = max(0, delta)
                fee_status = "overdue" if delta > 0 else "partial"
            else:
                fee_status = "partial" if (latest_fee.amount_due - latest_fee.amount_paid) > 0 else "ok"
        st.fee_status = fee_status
        st.risk_level = compute_risk_level(settings, st.attendance_pct, st.avg_score, days_overdue)
        db.add(st)
    db.commit()

def get_or_create_student(db: Session, student_id: str) -> models.Student:
    st = db.query(models.Student).filter_by(id=student_id).first()
    if not st:
        st = models.Student(id=student_id, name=f"Student {student_id}")
        db.add(st); db.commit(); db.refresh(st)
    return st

def get_or_create_subject(db: Session, name: str) -> models.Subject:
    s = db.query(models.Subject).filter_by(name=name).first()
    if not s:
        s = models.Subject(name=name)
        db.add(s); db.commit(); db.refresh(s)
    return s

app = create_app()
