from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import pandas as pd
import smtplib
from email.mime.text import MIMEText
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from openpyxl import Workbook
import sqlite3

app = Flask(__name__)
CORS(app)  # Allow React frontend to access backend

# In-memory storage (for now)
student_data = {
    "attendance": pd.DataFrame(),
    "exam_results": pd.DataFrame(),
    "fee_payments": pd.DataFrame()
}

@app.route('/upload/<data_type>', methods=['POST'])
def upload_file(data_type):
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    try:
        df = pd.read_excel(file)
        student_data[data_type] = df
        return jsonify({"message": f"{data_type} uploaded successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/data/<data_type>', methods=['GET'])
def get_data(data_type):
    if data_type not in student_data:
        return jsonify({"error": "Invalid data type"}), 400
    return student_data[data_type].to_json(orient="records")

def calculate_risk():
    # Check if all files are uploaded
    if student_data['attendance'].empty:
        return {"error": "Attendance file missing or empty"}
    if student_data['exam_results'].empty:
        return {"error": "Exam results file missing or empty"}
    if student_data['fee_payments'].empty:
        return {"error": "Fee payments file missing or empty"}

    att_df = student_data['attendance'].copy()
    exam_df = student_data['exam_results'].copy()
    fee_df = student_data['fee_payments'].copy()

    # --- Data validation and cleaning (your existing code is good here) ---
    required_att = {'student_id', 'name', 'present'}
    required_exam = {'student_id', 'name', 'score'}
    required_fee = {'student_id', 'name', 'amount_due', 'amount_paid'}

    if not required_att.issubset(att_df.columns):
        return {"error": "Attendance file must have: student_id, name, present"}
    if not required_exam.issubset(exam_df.columns):
        return {"error": "Exam results file must have: student_id, name, score"}
    if not required_fee.issubset(fee_df.columns):
        return {"error": "Fee payments file must have: student_id, name, amount_due, amount_paid"}

    # Ensure numeric values and drop NaNs
    exam_df['score'] = pd.to_numeric(exam_df['score'], errors='coerce')
    fee_df['amount_due'] = pd.to_numeric(fee_df['amount_due'], errors='coerce')
    fee_df['amount_paid'] = pd.to_numeric(fee_df['amount_paid'], errors='coerce')
    att_df['present'] = pd.to_numeric(att_df['present'], errors='coerce')
    exam_df = exam_df.dropna(subset=['score'])
    fee_df = fee_df.dropna(subset=['amount_due', 'amount_paid'])
    att_df = att_df.dropna(subset=['present'])

    # --- Calculate individual risks ---
    att_df['attendance_risk'] = att_df['present'].apply(lambda x: 0 if x >= 0.75 else 1)
    
    exam_risk_df = exam_df.groupby('student_id')['score'].min().reset_index()
    exam_risk_df['exam_risk'] = exam_risk_df['score'].apply(lambda x: 1 if x < 40 else 0)

    fee_risk_df = fee_df.groupby('student_id', group_keys=False)[['amount_due', 'amount_paid']].apply(
        lambda x: 1 if (x['amount_due'] - x['amount_paid']).sum() > 0 else 0
    ).reset_index(name='fee_risk')

    # --- Merge all risks and the name column ---
    # Start with attendance data to get student_id and name
    risk_df = att_df[['student_id', 'name']].drop_duplicates().copy()
    
    # Merge attendance risk
    att_risk_summary = att_df.groupby('student_id')['attendance_risk'].max().reset_index()
    risk_df = risk_df.merge(att_risk_summary, on='student_id', how='left')

    # Merge exam and fee risks
    risk_df = risk_df.merge(exam_risk_df[['student_id', 'exam_risk']], on='student_id', how='left')
    risk_df = risk_df.merge(fee_risk_df, on='student_id', how='left')

    # Fill NaN values that might result from the left merges
    risk_df[['attendance_risk', 'exam_risk', 'fee_risk']] = risk_df[['attendance_risk', 'exam_risk', 'fee_risk']].fillna(0)

    # --- Calculate final risk score and level (your existing code) ---
    risk_df['risk_score'] = (
        0.4 * risk_df['attendance_risk'] +
        0.4 * risk_df['exam_risk'] +
        0.2 * risk_df['fee_risk']
    )

    def risk_category(score):
        if score >= 0.7: return 'High'
        elif score >= 0.4: return 'Medium'
        return 'Low'
    
    risk_df['risk_level'] = risk_df['risk_score'].apply(risk_category)

    # Convert to dictionary for JSON response
    return risk_df.to_dict(orient='records')


@app.route('/risk', methods=['GET'])
def get_risk():
    risk_data = calculate_risk()
    if isinstance(risk_data, dict) and "error" in risk_data:
        return {"error": risk_data["error"]}
    return {"risk": risk_data}

def send_email_alert(to_email, subject, body):
    sender_email = "your_email@gmail.com"
    password = "your_app_password"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, to_email, msg.as_string())

@app.route('/send_alerts', methods=['POST'])
def send_alerts():
    risk_data = calculate_risk()  # Get calculated risk data
    
    # If there's an error, return it
    if isinstance(risk_data, dict) and "error" in risk_data:
        return jsonify({"error": risk_data["error"]}), 400
    
    # Convert to DataFrame for easier filtering
    risk_df = pd.DataFrame(risk_data)
    
    # If no risk data
    if risk_df.empty:
        return jsonify({"message": "No students found to send alerts."}), 200
    
    # Filter students at Medium or High risk
    risky_students = risk_df[risk_df['risk_level'] != 'Low']
    
    # Check if any risky students exist
    if risky_students.empty:
        return jsonify({"message": "No risky students to alert."}), 200

    # Send alerts
    for _, row in risky_students.iterrows():
        subject = "Student Risk Alert"
        body = f"Student ID {row['student_id']} is at {row['risk_level']} risk."
        
        # ✅ Make sure your CSVs have mentor_email or guardian_email column
        if 'mentor_email' in row and pd.notna(row['mentor_email']):
            send_email_alert(row['mentor_email'], subject, body)
    
    return jsonify({"message": f"Alerts sent to {len(risky_students)} recipients!"}), 200

@app.route('/student/<int:student_id>', methods=['GET'])
def get_student_details(student_id):
    """
    Fetch details of a student by ID from uploaded Excel files.
    """
    # Use the in-memory storage, not undefined variables
    attendance_df = student_data['attendance']
    exams_df = student_data['exam_results']
    fees_df = student_data['fee_payments']

    # --- Attendance Data ---
    student_attendance = attendance_df[attendance_df['student_id'] == student_id]
    attendance_list = student_attendance[['present']].to_dict(orient='records')

    # --- Exam Results ---
    student_exams = exams_df[exams_df['student_id'] == student_id]
    exams_list = student_exams[['score']].to_dict(orient='records')

    # --- Fee Details ---
    student_fees = fees_df[fees_df['student_id'] == student_id]
    fee_info = {}
    if not student_fees.empty:
        fee_info = {
            "amount_due": int(student_fees.iloc[0]['amount_due']),
            "amount_paid": int(student_fees.iloc[0]['amount_paid']),
             
        }

    # --- Student Name (if present in exam sheet or attendance sheet) ---
    name = None
    if 'name' in student_attendance.columns and not student_attendance.empty:
        name = student_attendance.iloc[0]['name']
    elif 'name' in student_exams.columns and not student_exams.empty:
        name = student_exams.iloc[0]['name']

    details = {
        "student_id": student_id,
        "name": name or "Unknown",
        "attendance": attendance_list,
        "exam_results": exams_list,
        "fees": fee_info
    }

    return jsonify(details)





if __name__ == '__main__':
    app.run(debug=True)
