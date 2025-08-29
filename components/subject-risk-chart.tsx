"use client"

import useSWR from "swr"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetcher, apiUrl } from "@/lib/api"
import type { Filters } from "./filters-bar"

export function SubjectRiskChart({ filters }: { filters: Filters }) {
  const { data } = useSWR<{ subject: string; high: number; medium: number; low: number }[]>(
    `${apiUrl()}/api/metrics/subject-risk?classId=${filters.classId}`,
    fetcher,
  )
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="low" stackId="a" fill="#16a34a" />
          <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
          <Bar dataKey="high" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
