"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wifi, Link2, AlertTriangle, ChevronRight } from "lucide-react"
import { PlanRow } from "@/components/tabs/hero-widgets"
import { EditSectionToggle } from "@/components/tabs/edit-section-toggle"
import { ConnectivityTab } from "@/components/tabs/connectivity-tab"
import type { Establecimiento as EstablecimientoFull } from "@/lib/establecimiento"

type SharedPredioSibling = { id: string; cue: number; nombre: string }

type Establecimiento = Pick<
  EstablecimientoFull,
  | "id"
  | "predio"
  | "plan_enlace"
  | "subplan_enlace"
  | "fecha_inicio_conectividad"
  | "mb"
  | "listado_conexion_internet"
  | "pnce_estado"
  | "proveedor_internet_pnce"
  | "fecha_instalacion_pnce"
  | "pnce_fecha_mejora"
  | "pnce_tipo_mejora"
  | "pba_grupo_1_estado"
  | "pba_grupo_1_proveedor_internet"
  | "pba_grupo_1_fecha_instalacion"
  | "reclamos_grupo_1_ani"
  | "pba_2019_estado"
  | "pba_2019_proveedor_internet"
  | "pba_2019_fecha_instalacion"
  | "pba_grupo_2_a_estado"
  | "pba_grupo_2_a_proveedor_internet"
  | "pba_grupo_2_a_fecha_instalacion"
  | "pba_grupo_2_a_fecha_mejora"
  | "pba_grupo_2_a_tipo_mejora"
  | "estado_instalacion_pba"
  | "proveedor_asignado_pba"
  | "plan_piso_tecnologico"
  | "tipo_piso_instalado"
  | "fecha_terminado_piso_tecnologico_cue"
  | "proveedor_piso_tecnologico_cue"
  | "fecha_mejora"
  | "tipo_mejora"
>

export function ConnectivitySection({
  establecimiento,
  sharedPredio = [],
}: {
  establecimiento: Establecimiento
  sharedPredio?: SharedPredioSibling[]
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const hasPlanes = establecimiento.plan_enlace || establecimiento.plan_piso_tecnologico
  const hasSharedPredio = sharedPredio.length > 0

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <EditSectionToggle isEditing={isEditing} onToggle={() => setIsEditing((v) => !v)} />
      </div>

      {isEditing ? (
        <ConnectivityTab establecimiento={establecimiento} isEditing={isEditing} onSaved={() => setIsEditing(false)} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {hasPlanes ? (
            <div className="space-y-1">
              <PlanRow icon={Link2} label="Plan de enlace" value={establecimiento.plan_enlace} color="#7c3aed" />
              <PlanRow
                icon={Wifi}
                label="Piso tecnológico"
                value={establecimiento.plan_piso_tecnologico}
                color="#00AEC3"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400">Sin datos de conectividad cargados</p>
          )}

          {hasSharedPredio && (
            <div className={!hasPlanes ? "sm:col-span-2" : ""}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <p className="text-[10px] font-medium uppercase tracking-wide text-amber-400">
                  Comparte predio ({establecimiento.predio})
                </p>
              </div>
              <div className="space-y-1.5">
                {sharedPredio.map((sibling) => (
                  <button
                    key={sibling.id}
                    type="button"
                    onClick={() => router.push(`/establecimientos/${sibling.id}`)}
                    className="group flex w-full items-center justify-between gap-2 rounded-md border border-amber-500/30 bg-amber-500/15/50 px-2.5 py-1.5 text-left transition-colors hover:border-amber-500/60 hover:bg-amber-500/25/60"
                  >
                    <span className="min-w-0 text-xs text-slate-100">
                      <span className="font-medium">{sibling.nombre}</span>
                      <span className="ml-1.5 text-slate-400">CUE {sibling.cue}</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-amber-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
