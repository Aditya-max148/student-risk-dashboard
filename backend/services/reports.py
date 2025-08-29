from datetime import date, timedelta
from sqlalchemy.orm import Session
from backend import models

def build_weekly_reports(db: Session):
    week_ago = date.today() - timedelta(days=7)
    students = db.query(models.Student).all()
    reports = []
    for st in students:
        # gather last week attendance and scores
        att = db.query(models.Attendance).filter(models.Attendance.student_id == st.id, models.Attendance.date >= week_ago).all()
        exams = db.query(models.ExamResult).filter(models.ExamResult.student_id == st.id, models.ExamResult.date >= week_ago).all()
        report = {
            "student_id": st.id,
            "student_name": st.name,
            "risk_level": st.risk_level,
            "attendance_pct_week": round((sum(1 for a in att if a.present)/len(att))*100, 1) if att else None,
            "avg_score_week": round(sum(e.score for e in exams)/len(exams), 1) if exams else None,
            "summary": summarize(st, att, exams),
        }
        reports.append(report)
    return reports

def summarize(st: models.Student, att, exams):
    parts = [f"Student: {st.name} (Risk: {st.risk_level})"]
    if att:
        pct = round((sum(1 for a in att if a.present)/len(att))*100, 1)
        parts.append(f"Attendance (last 7 days): {pct}%")
    if exams:
        avg = round(sum(e.score for e in exams)/len(exams), 1)
        parts.append(f"Avg Score (last 7 days): {avg}")
    return " | ".join(parts)
