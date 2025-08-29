"use client"

import { cn } from "@/lib/utils"

export function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const map = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
  }
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", map[level])}>
      {level === "low" ? "Low" : level === "medium" ? "Medium" : "High"}
    </span>
  )
}
