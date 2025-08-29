"use client"

import useSWR from "swr"
import { fetcher, apiUrl } from "@/lib/api"

export type Filters = {
  classId: string
  subjectId: string
  risk: "all" | "low" | "medium" | "high"
}

type Option = { id: string; name: string }

export function FiltersBar({ value, onChange }: { value: Filters; onChange: (v: Filters) => void }) {
  const { data: classes } = useSWR<Option[]>(`${apiUrl()}/api/classes`, fetcher)
  const { data: subjects } = useSWR<Option[]>(`${apiUrl()}/api/subjects`, fetcher)

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <select
        className="h-9 rounded-md border px-2"
        value={value.classId}
        onChange={(e) => onChange({ ...value, classId: e.target.value })}
      >
        <option value="all">All classes</option>
        {classes?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="h-9 rounded-md border px-2"
        value={value.subjectId}
        onChange={(e) => onChange({ ...value, subjectId: e.target.value })}
      >
        <option value="all">All subjects</option>
        {subjects?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className="h-9 rounded-md border px-2"
        value={value.risk}
        onChange={(e) => onChange({ ...value, risk: e.target.value as Filters["risk"] })}
      >
        <option value="all">All risk levels</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  )
}
