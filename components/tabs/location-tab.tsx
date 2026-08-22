"use client"

import dynamic from "next/dynamic"
import { MapPin, AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import type { Establecimiento as EstablecimientoFull } from "@/lib/establecimiento"

const LocationMap = dynamic(() => import("@/components/tabs/location-map").then((mod) => mod.LocationMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
})

type Establecimiento = Pick<EstablecimientoFull, "nombre" | "direccion" | "ciudad" | "distrito" | "lat" | "lon">

export function LocationTab({ establecimiento }: { establecimiento: Establecimiento }) {
  const hasCoordinates =
    typeof establecimiento.lat === "number" &&
    typeof establecimiento.lon === "number" &&
    !Number.isNaN(establecimiento.lat) &&
    !Number.isNaN(establecimiento.lon)

  return (
    <div className="space-y-6 py-4">
      <div className="border-b-2 border-gray-300 pb-2 mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ubicación</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Latitud</Label>
          <p className="text-sm text-foreground">{establecimiento.lat ?? "Sin datos"}</p>
        </div>
        <div className="space-y-2">
          <Label>Longitud</Label>
          <p className="text-sm text-foreground">{establecimiento.lon ?? "Sin datos"}</p>
        </div>
      </div>

      {hasCoordinates ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm" style={{ height: "420px" }}>
          <LocationMap
            lat={establecimiento.lat as number}
            lon={establecimiento.lon as number}
            nombre={establecimiento.nombre}
            direccion={establecimiento.direccion}
          />
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
          <p className="text-sm font-medium text-foreground">Sin coordenadas registradas</p>
          <p className="text-xs text-muted-foreground">
            Este establecimiento no cuenta con latitud y longitud para mostrar en el mapa.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-4">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {establecimiento.direccion ? `${establecimiento.direccion}, ` : ""}
          {establecimiento.ciudad ? `${establecimiento.ciudad} - ` : ""}
          {establecimiento.distrito || ""}
        </p>
      </div>
    </div>
  )
}
