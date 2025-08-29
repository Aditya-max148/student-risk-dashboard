"use client"

import type React from "react"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetcher, apiUrl } from "@/lib/api"

type Settings = {
  attendance_low: number
  attendance_medium: number
  score_low: number
  score_medium: number
  fee_days_overdue_medium: number
  fee_days_overdue_high: number
}

export default function SettingsPage() {
  const { data, mutate } = useSWR<Settings>(`${apiUrl()}/api/settings`, fetcher)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Settings | null>(null)

  const settings = form ?? data

  function bind<K extends keyof Settings>(key: K) {
    return {
      value: settings?.[key] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...(settings as Settings), [key]: Number.parseFloat(e.target.value) }),
    }
  }

  async function save() {
    if (!settings) return
    setSaving(true)
    await fetch(`${apiUrl()}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setForm(null)
    mutate()
  }

  return (
    <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Risk thresholds</CardTitle>
          <CardDescription>Adjust thresholds used in rule-based risk calculation.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Attendance low-risk min (%)</label>
            <Input type="number" step="1" {...bind("attendance_low")} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Attendance medium-risk min (%)</label>
            <Input type="number" step="1" {...bind("attendance_medium")} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Score low-risk min</label>
            <Input type="number" step="1" {...bind("score_low")} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Score medium-risk min</label>
            <Input type="number" step="1" {...bind("score_medium")} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Fee overdue days (medium)</label>
            <Input type="number" step="1" {...bind("fee_days_overdue_medium")} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Fee overdue days (high)</label>
            <Input type="number" step="1" {...bind("fee_days_overdue_high")} />
          </div>
          <div>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
