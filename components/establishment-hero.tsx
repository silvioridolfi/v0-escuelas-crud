import { Building2, MapPin } from "lucide-react"
import type { Establecimiento } from "@/lib/establecimiento"
import type React from "react"

export function EstablishmentHero({
  establecimiento,
  centerSlot,
}: {
  establecimiento: Establecimiento
  centerSlot?: React.ReactNode
}) {
  const isClosedOrContext =
    establecimiento.tipo_establecimiento === "Escuela cerrada" || establecimiento.tipo_establecimiento === "Contexto de encierro"

  return (
    <div>
      {/* Header: icono+CUE+distrito | nav de pestañas (centrado) | badge de estado */}
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#417099]/10">
            <Building2 className="h-6 w-6 text-[#417099]" />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">CUE</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{establecimiento.cue}</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/20" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">Distrito</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{establecimiento.distrito}</p>
            </div>
          </div>
        </div>

        {centerSlot && <div className="flex justify-center">{centerSlot}</div>}

        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:justify-self-end ${
            isClosedOrContext ? "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400" : "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isClosedOrContext ? "bg-red-50 dark:bg-red-500/150" : "bg-emerald-50 dark:bg-emerald-500/150"}`} />
          {isClosedOrContext ? establecimiento.tipo_establecimiento?.toUpperCase() : "ACTIVA"}
        </span>
      </div>

      {/* Nombre + dirección */}
      <h2 className="mt-4 text-xl font-bold leading-tight text-slate-900 dark:text-white sm:text-2xl">{establecimiento.nombre}</h2>
      <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-600 dark:text-gray-200">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00AEC3]" />
        {[establecimiento.direccion, establecimiento.ciudad, establecimiento.distrito].filter(Boolean).join(", ")}
      </p>
    </div>
  )
}
