"use client"

import { useEffect, useState } from "react"
import { getHistorial, type HistorialEntry } from "@/app/actions/get-historial"
import { History, ArrowRight } from "lucide-react"

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Agrupa entradas guardadas en el mismo segundo/acción (misma sección + timestamp cercano)
function groupBySave(entries: HistorialEntry[]) {
  const groups: { key: string; seccion: string; created_at: string; items: HistorialEntry[] }[] = []
  for (const entry of entries) {
    const last = groups[groups.length - 1]
    const sameGroup =
      last && last.seccion === entry.seccion && Math.abs(new Date(last.created_at).getTime() - new Date(entry.created_at).getTime()) < 5000
    if (sameGroup) {
      last.items.push(entry)
    } else {
      groups.push({ key: entry.id, seccion: entry.seccion, created_at: entry.created_at, items: [entry] })
    }
  }
  return groups
}

export function HistorialTab({ establecimientoId }: { establecimientoId: string }) {
  const [entries, setEntries] = useState<HistorialEntry[] | null>(null)

  useEffect(() => {
    getHistorial(establecimientoId).then(setEntries)
  }, [establecimientoId])

  if (entries === null) {
    return <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-300">Cargando historial…</div>
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-600 dark:text-gray-200">Todavía no hay cambios registrados</p>
        <p className="mt-1 text-xs text-slate-400">Los cambios que se guarden de acá en más van a aparecer acá</p>
      </div>
    )
  }

  const groups = groupBySave(entries)

  return (
    <div className="space-y-4 py-4">
      {groups.map((group) => (
        <div key={group.key} className="rounded-lg border border-slate-200 bg-white dark:bg-white/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-200">
              {group.seccion}
            </span>
            <span className="text-xs text-slate-400">{formatFecha(group.created_at)}</span>
          </div>
          <div className="space-y-2">
            {group.items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-slate-700 dark:text-gray-100">{item.campo}:</span>
                <span className="text-slate-400 line-through">{item.valor_anterior || "(vacío)"}</span>
                <ArrowRight className="h-3 w-3 text-slate-300" />
                <span className="text-slate-800 dark:text-white">{item.valor_nuevo || "(vacío)"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
