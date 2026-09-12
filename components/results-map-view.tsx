"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import type { SearchResult } from "@/app/actions/search"

function pinIcon(color: string) {
  const svg = `
    <svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 23 13 23s13-13.5 13-23C26 5.8 20.2 0 13 0z" fill="${color}"/>
      <circle cx="13" cy="13" r="5.5" fill="white"/>
    </svg>
  `
  return L.divIcon({ html: svg, className: "", iconSize: [26, 36], iconAnchor: [13, 36], popupAnchor: [0, -32] })
}

const iconEstablecimiento = pinIcon("var(--color-pba-teal)")
const iconOrganismo = pinIcon("#6366f1")
const iconCerrada = pinIcon("#ef4444")

const DEFAULT_CENTER: [number, number] = [-34.92, -57.95]

// Ajusta el zoom/centro del mapa a los puntos visibles -- si son 3
// resultados en el mismo distrito, no tiene sentido mostrar toda Región 1.
function FitToPoints({ points }: { points: { lat: number; lon: number }[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lon], 15)
      return
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lon] as [number, number]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }, [points, map])
  return null
}

export function ResultsMapView({ results }: { results: SearchResult[] }) {
  const points = results.filter(
    (r): r is SearchResult & { lat: number; lon: number } =>
      typeof r.lat === "number" && typeof r.lon === "number" && !Number.isNaN(r.lat) && !Number.isNaN(r.lon),
  )

  if (points.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-slate-200 dark:border-border bg-slate-50 dark:bg-surface-subtle text-sm text-slate-500 dark:text-gray-300">
        Ninguno de estos resultados tiene ubicación cargada todavía.
      </div>
    )
  }

  const sinUbicacion = results.length - points.length

  return (
    <div className="space-y-2">
      {sinUbicacion > 0 && (
        <p className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
          Mostrando {points.length} de {results.length} resultados en el mapa — {sinUbicacion}{" "}
          {sinUbicacion === 1 ? "no tiene" : "no tienen"} ubicación cargada todavía.
        </p>
      )}
      <div className="h-[60vh] w-full overflow-hidden rounded-lg border border-slate-200 dark:border-border shadow-sm">
      <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPoints points={points} />
        {points.map((p) => {
          const isOrganismo = p.entity_type === "organismo"
          const isClosedOrContext =
            p.tipo_establecimiento === "Escuela cerrada" || p.tipo_establecimiento === "Contexto de encierro"
          const icon = isOrganismo ? iconOrganismo : isClosedOrContext ? iconCerrada : iconEstablecimiento
          const href = isOrganismo ? `/organismos/${p.id}` : `/establecimientos/${p.id}`
          return (
            <Marker key={`${p.entity_type}-${p.id}`} position={[p.lat, p.lon]} icon={icon}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{p.nombre}</p>
                  {!isOrganismo && p.cue && <p className="text-xs text-slate-500 dark:text-gray-300">CUE: {p.cue}</p>}
                  {isOrganismo && p.codigo && <p className="text-xs text-slate-500 dark:text-gray-300">Código: {p.codigo}</p>}
                  {p.distrito && <p className="text-xs text-slate-500 dark:text-gray-300">{p.distrito}</p>}
                  {p.fed_a_cargo && <p className="text-xs text-slate-500 dark:text-gray-300">FED: {p.fed_a_cargo}</p>}
                  <Link href={href} className="text-xs font-medium text-pba-teal hover:underline">
                    Ver ficha →
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      </div>
    </div>
  )
}
