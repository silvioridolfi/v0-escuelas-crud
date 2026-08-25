"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { MapPoint } from "@/app/actions/get-map-points"

const iconEstablecimiento = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const iconOrganismo = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33],
  className: "hue-rotate-[220deg]",
})

// Centro aproximado de Región 1 (La Plata)
const DEFAULT_CENTER: [number, number] = [-34.95, -57.95]

export function GeneralMap({ points }: { points: MapPoint[] }) {
  const [distritoFilter, setDistritoFilter] = useState<string>("ALL")
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
          <SelectTrigger className="w-[220px] bg-white">
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
          <SelectTrigger className="w-[220px] bg-white">
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

        <Badge variant="outline" className="border-slate-300 text-slate-600">
          {filtered.length.toLocaleString("es-AR")} puntos
        </Badge>
      </div>

      <div className="h-[70vh] w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
        <MapContainer center={DEFAULT_CENTER} zoom={10} scrollWheelZoom style={{ height: "100%", width: "100%" }} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((p) => (
            <Marker key={`${p.entity_type}-${p.id}`} position={[p.lat, p.lon]} icon={p.entity_type === "organismo" ? iconOrganismo : iconEstablecimiento}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{p.nombre}</p>
                  {p.cue && <p className="text-xs text-slate-500">CUE: {p.cue}</p>}
                  {p.distrito && <p className="text-xs text-slate-500">{p.distrito}</p>}
                  {p.fed_a_cargo && <p className="text-xs text-slate-500">FED: {p.fed_a_cargo}</p>}
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
