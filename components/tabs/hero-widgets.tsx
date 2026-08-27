import type React from "react"

export function initials(nombre: string | null, apellido: string | null) {
  const a = nombre?.[0] || ""
  const b = apellido?.[0] || ""
  return (a + b).toUpperCase() || "?"
}

export function StatTile({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-800 break-words">{value || "—"}</p>
    </div>
  )
}

export function PlanRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  value: string | null | undefined
  color: string
}) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 border-l-2 py-2 pl-3" style={{ borderColor: color }}>
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}
