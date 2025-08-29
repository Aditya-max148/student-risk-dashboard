export type StudentSummary = {
  student_id: string
  name: string
  class_id: string
  class_name: string
  attendance_pct: number
  avg_score: number
  fee_status: "ok" | "overdue" | "partial"
  risk_level: "low" | "medium" | "high"
}
