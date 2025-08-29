"use client"

import useSWR from "swr"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetcher, apiUrl } from "@/lib/api"
import type { Filters } from "./filters-bar"

export function AttendanceTrendChart({ filters }: { filters: Filters }) {
  const { data } = useSWR<{ date: string; attendance_pct: number }[]>(
    `${apiUrl()}/api/metrics/attendance-trend?classId=${filters.classId}&subjectId=${filters.subjectId}`,
    fetcher,
  )
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="attendance_pct" stroke="#2563eb" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
