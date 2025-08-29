from sqlalchemy import Column, String, Integer, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(String, primary_key=True)
    name = Column(String, unique=True, nullable=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    class_id = Column(String, ForeignKey("classrooms.id"), nullable=True)

    attendance_pct = Column(Float, default=0.0)
    avg_score = Column(Float, default=0.0)
    fee_status = Column(String, default="ok")
    risk_level = Column(String, default="low")

    classroom = relationship("Classroom")
    exam_results = relationship("ExamResult", back_populates="student")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    date = Column(Date, nullable=False)
    present = Column(Boolean, default=False)

class ExamResult(Base):
    __tablename__ = "exam_results"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    date = Column(Date, nullable=False)
    score = Column(Float, nullable=False)

    student = relationship("Student", back_populates="exam_results")
    subject = relationship("Subject")

class FeePayment(Base):
    __tablename__ = "fee_payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    due_date = Column(Date, nullable=True)
    paid_date = Column(Date, nullable=True)
    amount_due = Column(Float, default=0.0)
    amount_paid = Column(Float, default=0.0)

class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    # attendance >= low -> low risk, >= medium -> medium risk; else high
    attendance_low = Column(Float, default=90.0)
    attendance_medium = Column(Float, default=75.0)
    # score >= low -> low risk, >= medium -> medium risk; else high
    score_low = Column(Float, default=70.0)
    score_medium = Column(Float, default=50.0)
    # fee overdue days
    fee_days_overdue_medium = Column(Integer, default=7)
    fee_days_overdue_high = Column(Integer, default=30)

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    type = Column(String, nullable=False)  # "parent" or "mentor"
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
