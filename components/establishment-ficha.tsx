import type React from "react"
import { Building2, MapPin, Users, GraduationCap, UserRound, Landmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Establecimiento } from "@/lib/establecimiento"

function FichaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm text-slate-700">{value}</p>
      </div>
    </div>
  )
}

export function EstablishmentFicha({
  establecimiento,
  isGovernmentBuilding,
}: {
  establecimiento: Establecimiento
  isGovernmentBuilding: boolean
}) {
  return (
    <aside className="lg:w-72 lg:shrink-0">
      <div className="rounded-lg border border-slate-200/60 bg-white p-5 shadow-md lg:sticky lg:top-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#417099]/10">
            <Building2 className="h-5 w-5 text-[#417099]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">CUE</p>
            <p className="text-sm font-semibold text-slate-800">{establecimiento.cue}</p>
          </div>
        </div>

        {isGovernmentBuilding && (
          <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            Edificio Gubernamental
          </Badge>
        )}

        <div className="divide-y divide-slate-100">
          <FichaRow icon={MapPin} label="Distrito / Ciudad" value={`${establecimiento.distrito} · ${establecimiento.ciudad}`} />
          <FichaRow icon={MapPin} label="Dirección" value={establecimiento.direccion} />
          <FichaRow icon={Landmark} label="Dependencia" value={establecimiento.dependencia_completa} />
          {!isGovernmentBuilding && (
            <>
              <FichaRow icon={UserRound} label="FED a cargo" value={establecimiento.fed_a_cargo || "Sin asignar"} />
              <FichaRow
                icon={GraduationCap}
                label="Nivel / Modalidad"
                value={
                  establecimiento.nivel || establecimiento.modalidad
                    ? `${establecimiento.nivel || ""}${establecimiento.nivel && establecimiento.modalidad ? " · " : ""}${establecimiento.modalidad || ""}`
                    : null
                }
              />
              <FichaRow
                icon={Users}
                label="Matrícula"
                value={establecimiento.matricula ? establecimiento.matricula.toLocaleString("es-AR") : null}
              />
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
