"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AlertTriangle, ShieldAlert, UserX, MailX, Sparkles, X } from "lucide-react"
import { getQuickFilterCount, getQuickFilterResults } from "@/app/actions/quick-filters"
import { type QuickFilterKey, QUICK_FILTERS } from "@/lib/quick-filters-config"
import type { SearchResult } from "@/app/actions/search"

const ICONS: Record<QuickFilterKey, React.ComponentType<{ className?: string }>> = {
  cerradas: AlertTriangle,
  contexto: ShieldAlert,
  sin_fed: UserX,
  sin_contacto: MailX,
  nuevos: Sparkles,
}

const COLORS: Record<QuickFilterKey, string> = {
  cerradas: "text-red-700 bg-red-50 border-red-200 hover:bg-red-100",
  contexto: "text-red-700 bg-red-50 border-red-200 hover:bg-red-100",
  sin_fed: "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100",
  sin_contacto: "text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100",
  nuevos: "text-[#00AEC3] bg-[#00AEC3]/10 border-[#00AEC3]/30 hover:bg-[#00AEC3]/20",
}

export function QuickFilters({
  onSelect,
  activeFilter,
}: {
  onSelect: (filter: QuickFilterKey | null, results: SearchResult[]) => void
  activeFilter: QuickFilterKey | null
}) {
  const [counts, setCounts] = useState<Partial<Record<QuickFilterKey, number>>>({})
  const [loadingFilter, setLoadingFilter] = useState<QuickFilterKey | null>(null)

  useEffect(() => {
    QUICK_FILTERS.forEach(async ({ key }) => {
      const count = await getQuickFilterCount(key)
      setCounts((prev) => ({ ...prev, [key]: count }))
    })
  }, [])

  const handleClick = async (key: QuickFilterKey) => {
    if (activeFilter === key) {
      onSelect(null, [])
      return
    }
    setLoadingFilter(key)
    const results = await getQuickFilterResults(key)
    setLoadingFilter(null)
    onSelect(key, results)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {QUICK_FILTERS.map(({ key, label }) => {
        const Icon = ICONS[key]
        const isActive = activeFilter === key
        const count = counts[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            disabled={loadingFilter === key}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              isActive ? `${COLORS[key]} ring-2 ring-offset-1` : `${COLORS[key]} opacity-80 hover:opacity-100`
            }`}
          >
            {isActive ? <X className="h-3 w-3" /> : <Icon className="h-3.5 w-3.5" />}
            {label}
            {count !== undefined && (
              <span className="ml-0.5 rounded-full bg-white/60 px-1.5 text-[10px] font-semibold">
                {loadingFilter === key ? "…" : count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
