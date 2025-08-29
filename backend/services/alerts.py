import os
from typing import List, Dict
from sqlalchemy.orm import Session
from backend import models
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr

from twilio.rest import Client as TwilioClient

def send_alerts(db: Session, reports: List[Dict]):
    # Email
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "noreply@example.com")

    # Twilio
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_from = os.getenv("TWILIO_FROM_NUMBER")

    twilio_client = None
    if twilio_sid and twilio_token:
        twilio_client = TwilioClient(twilio_sid, twilio_token)

    for rep in reports:
        student_id = rep["student_id"]
        contacts = db.query(models.Contact).filter(models.Contact.student_id == student_id).all()
        if not contacts:
            continue
        subject = f"[Weekly Alert] {rep['student_name']} - Risk: {rep['risk_level'].title()}"
        body = rep["summary"]

        # Email
        if smtp_host and smtp_user and smtp_pass:
            send_email(smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, contacts, subject, body)

        # SMS
        if twilio_client and twilio_from:
            send_sms(twilio_client, twilio_from, contacts, body)

def send_email(host, port, user, password, sender, contacts, subject, body):
    msg = MIMEText(body)
    msg["From"] = formataddr(("Early Risk Alerts", sender))
    msg["Subject"] = subject
    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        for c in contacts:
            if not c.email: continue
            msg["To"] = c.email
            server.sendmail(sender, [c.email], msg.as_string())

def send_sms(client: TwilioClient, from_number: str, contacts, body: str):
    for c in contacts:
        if not c.phone: continue
        client.messages.create(from_=from_number, to=c.phone, body=body)
