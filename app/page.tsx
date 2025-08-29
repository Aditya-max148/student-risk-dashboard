"use client"

import useSWR from "swr"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskBadge } from "@/components/risk-badge"
import { FiltersBar, type Filters } from "@/components/filters-bar"
import { AttendanceTrendChart } from "@/components/attendance-trend-chart"
import { ScoreProgressionChart } from "@/components/score-progression-chart"
import { SubjectRiskChart } from "@/components/subject-risk-chart"
import { fetcher, apiUrl } from "@/lib/api"
import type { StudentSummary } from "@/types"

export default function Page() {
  const [filters, setFilters] = useState<Filters>({ classId: "all", subjectId: "all", risk: "all" })

  const { data: summary } = useSWR<{ total: number; low: number; medium: number; high: number }>(
    `${apiUrl()}/api/metrics/risk-summary?classId=${filters.classId}&subjectId=${filters.subjectId}`,
    fetcher,
  )

  const { data: students } = useSWR<StudentSummary[]>(
    `${apiUrl()}/api/students?classId=${filters.classId}&subjectId=${filters.subjectId}&risk=${filters.risk}`,
    fetcher,
  )

  return (
    <main className="px-4 py-6 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-pretty">Early Student Risk Alert Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/upload">
            <Button variant="secondary">Upload Data</Button>
          </Link>
          <Link href="/settings">
            <Button>Settings</Button>
          </Link>
        </div>
      </header>

      <FiltersBar value={filters} onChange={setFilters} />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{summary?.total ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medium Risk</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <RiskBadge level="medium" />
            <p className="text-3xl font-semibold">{summary?.medium ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>High Risk</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <RiskBadge level="high" />
            <p className="text-3xl font-semibold">{summary?.high ?? "—"}</p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Trend</TabsTrigger>
          <TabsTrigger value="scores">Score Progression</TabsTrigger>
          <TabsTrigger value="subjects">Subject Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTrendChart filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <CardTitle>Score Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreProgressionChart filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subject-level Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <SubjectRiskChart filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Students</h2>
          <Link href="/upload" className="text-sm underline">
            Update data
          </Link>
        </div>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="[&>th]:text-left [&>th]:p-3">
                <th>Name</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>Avg Score</th>
                <th>Fees</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((s) => (
                <tr key={s.student_id} className="[&>td]:p-3 border-t">
                  <td>{s.name}</td>
                  <td>{s.class_name}</td>
                  <td>{s.attendance_pct?.toFixed(1)}%</td>
                  <td>{s.avg_score?.toFixed(1)}</td>
                  <td>{s.fee_status}</td>
                  <td>
                    <RiskBadge level={s.risk_level} />
                  </td>
                </tr>
              )) ?? (
                <tr>
                  <td className="p-3" colSpan={6}>
                    No data yet. Upload files to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
