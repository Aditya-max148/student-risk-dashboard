"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState<string | null>(null)

  async function testConnection() {
    setHealth("Testing...")
    try {
      const res = await fetch("/api/health")
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setHealth(
          `Backend not reachable (status ${res.status}). ${data?.error || data?.message || ""} ${data?.target ? `Target: ${data.target}` : ""}`,
        )
      } else {
        setHealth(
          `Backend OK. ${data?.body?.time ? `Time: ${data.body.time}` : ""} ${data?.target ? `Target: ${data.target}` : ""}`,
        )
      }
    } catch (e: any) {
      setHealth(`Health check failed: ${e?.message || "Unknown error"}`)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        let msg = ""
        const ct = res.headers.get("content-type") || ""
        if (ct.includes("application/json")) {
          const j = await res.json().catch(() => null)
          msg = j?.error || j?.message || (typeof j === "object" ? JSON.stringify(j) : String(j))
        } else {
          msg = await res.text()
        }
        throw new Error(msg || `HTTP ${res.status}`)
      }
      const json = await res.json()
      setStatus(`Uploaded and processed: ${json.processed} records`)
      form.reset()
    } catch (err: any) {
      const friendly =
        err?.message?.includes("Failed to fetch") || err?.message?.includes("Proxy to backend failed")
          ? "Network error: could not reach backend. Click 'Test Connection' for details."
          : err?.message
      setStatus(`Upload failed: ${friendly}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Upload Data</h1>
      <Card>
        <CardHeader>
          <CardTitle>Attendance, Exams, Fees</CardTitle>
          <CardDescription>Upload CSV or Excel files. Columns should include a consistent student_id.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={testConnection}>
              Test Connection
            </Button>
            {health && <span className="text-xs text-muted-foreground">{health}</span>}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Attendance file</label>
              <input
                name="attendance"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="block"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Exam results file</label>
              <input
                name="exams"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="block"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Fee payments file</label>
              <input
                name="fees"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="block"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Upload & Process"}
            </Button>
          </form>
          {status && <p className="mt-4 text-sm">{status}</p>}
          <p className="mt-4 text-xs text-muted-foreground">
            Required columns: attendance: student_id, date, present (0/1); exams: student_id, subject, date, score
            (0-100); fees: student_id, due_date, paid_date, amount_due, amount_paid.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
