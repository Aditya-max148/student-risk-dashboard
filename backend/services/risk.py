from backend.models import Settings

def compute_risk_level(settings: Settings, attendance_pct: float, avg_score: float, fee_days_overdue: int) -> str:
    # Score component
    if avg_score >= settings.score_low:
      score_risk = "low"
    elif avg_score >= settings.score_medium:
      score_risk = "medium"
    else:
      score_risk = "high"

    # Attendance component
    if attendance_pct >= settings.attendance_low:
      att_risk = "low"
    elif attendance_pct >= settings.attendance_medium:
      att_risk = "medium"
    else:
      att_risk = "high"

    # Fee component
    if fee_days_overdue >= settings.fee_days_overdue_high:
      fee_risk = "high"
    elif fee_days_overdue >= settings.fee_days_overdue_medium:
      fee_risk = "medium"
    else:
      fee_risk = "low"

    # Aggregate: if any high -> high; else if any medium -> medium; else low
    if "high" in (score_risk, att_risk, fee_risk):
      return "high"
    if "medium" in (score_risk, att_risk, fee_risk):
      return "medium"
    return "low"

def ensure_default_settings(db):
    from backend.models import Settings
    s = db.query(Settings).first()
    if not s:
        s = Settings()
        db.add(s); db.commit(); db.refresh(s)
    return s
