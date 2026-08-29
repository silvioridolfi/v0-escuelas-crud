"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { MapPoint } from "@/app/actions/get-map-points"

// Pines propios en SVG (en vez de las variantes de color de Leaflet, que
// son casi indistinguibles entre sí) -- teal para establecimientos,
// índigo para organismos, mismos colores que los tags del buscador.
function pinIcon(color: string) {
  const svg = `
    <svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 23 13 23s13-13.5 13-23C26 5.8 20.2 0 13 0z" fill="${color}"/>
      <circle cx="13" cy="13" r="5.5" fill="white"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [26, 36],
    iconAnchor: [13, 36],
    popupAnchor: [0, -32],
  })
}

const iconEstablecimiento = pinIcon("#00AEC3")
const iconOrganismo = pinIcon("#6366f1")

// Centro aproximado de La Plata
const DEFAULT_CENTER: [number, number] = [-34.92, -57.95]
const DEFAULT_DISTRITO = "LA PLATA"

export function GeneralMap({ points }: { points: MapPoint[] }) {
  const [distritoFilter, setDistritoFilter] = useState<string>(DEFAULT_DISTRITO)
  const [fedFilter, setFedFilter] = useState<string>("ALL")

  useEffect(() => {
    window.dispatchEvent(new Event("resize"))
  }, [])

  const distritos = useMemo(
    () => Array.from(new Set(points.map((p) => p.distrito).filter(Boolean))).sort() as string[],
    [points],
  )
  const feds = useMemo(
    () => Array.from(new Set(points.map((p) => p.fed_a_cargo).filter(Boolean))).sort() as string[],
    [points],
  )

  const filtered = points.filter((p) => {
    if (distritoFilter !== "ALL" && p.distrito !== distritoFilter) return false
    if (fedFilter !== "ALL" && p.fed_a_cargo !== fedFilter) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={distritoFilter} onValueChange={setDistritoFilter}>
          <SelectTrigger className="w-[220px] bg-white dark:bg-white/10">
            <SelectValue placeholder="Distrito" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los distritos</SelectItem>
            {distritos.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={fedFilter} onValueChange={setFedFilter}>
          <SelectTrigger className="w-[220px] bg-white dark:bg-white/10">
            <SelectValue placeholder="FED a cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los FED</SelectItem>
            {feds.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge variant="outline" className="border-slate-300 text-slate-600 dark:text-gray-200">
          {filtered.length.toLocaleString("es-AR")} puntos
        </Badge>

        <div className="ml-auto flex items-center gap-3 text-xs text-slate-500 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#00AEC3]" />
            Establecimientos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
            Organismos
          </span>
        </div>
      </div>

      <div className="h-[70vh] w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
        <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom style={{ height: "100%", width: "100%" }} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((p) => (
            <Marker key={`${p.entity_type}-${p.id}`} position={[p.lat, p.lon]} icon={p.entity_type === "organismo" ? iconOrganismo : iconEstablecimiento}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{p.nombre}</p>
                  {p.cue && <p className="text-xs text-slate-500 dark:text-gray-300">CUE: {p.cue}</p>}
                  {p.distrito && <p className="text-xs text-slate-500 dark:text-gray-300">{p.distrito}</p>}
                  {p.fed_a_cargo && <p className="text-xs text-slate-500 dark:text-gray-300">FED: {p.fed_a_cargo}</p>}
                  {p.entity_type === "establecimiento" && (
                    <Link href={`/establecimientos/${p.id}`} className="text-xs font-medium text-[#00AEC3] hover:underline">
                      Ver ficha →
                    </Link>
                  )}
                  {p.entity_type === "organismo" && (
                    <Link href={`/organismos/${p.id}`} className="text-xs font-medium text-[#00AEC3] hover:underline">
                      Ver ficha →
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
