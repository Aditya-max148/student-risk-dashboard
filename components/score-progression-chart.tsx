"use client"

import useSWR from "swr"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetcher, apiUrl } from "@/lib/api"
import type { Filters } from "./filters-bar"

export function ScoreProgressionChart({ filters }: { filters: Filters }) {
  const { data } = useSWR<{ date: string; avg_score: number }[]>(
    `${apiUrl()}/api/metrics/score-progression?classId=${filters.classId}&subjectId=${filters.subjectId}`,
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
          <Line type="monotone" dataKey="avg_score" stroke="#16a34a" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
