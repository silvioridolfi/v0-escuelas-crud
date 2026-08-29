"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AlertTriangle, ShieldAlert, UserX, MailX, Sparkles, X } from "lucide-react"
import { getAllQuickFilterCounts, getQuickFilterResults } from "@/app/actions/quick-filters"
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
  cerradas: "text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
  contexto: "text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
  sin_fed: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
  sin_contacto: "text-orange-700 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20",
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
    getAllQuickFilterCounts().then(setCounts)
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
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC3] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
              isActive ? `${COLORS[key]} ring-2 ring-offset-1` : `${COLORS[key]} opacity-80 hover:opacity-100`
            }`}
          >
            {isActive ? <X className="h-3 w-3" /> : <Icon className="h-3.5 w-3.5" />}
            {label}
            {count !== undefined && (
              <span className="ml-0.5 rounded-full bg-white/60 dark:bg-white/10 px-1.5 text-[10px] font-semibold">
                {loadingFilter === key ? "…" : count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
