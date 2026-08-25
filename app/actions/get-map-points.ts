"use server"

import { createClient } from "@/lib/supabase/server"

export type MapPoint = {
  id: string
  nombre: string
  cue: number | null
  distrito: string | null
  fed_a_cargo: string | null
  nivel: string | null
  lat: number
  lon: number
  entity_type: "establecimiento" | "organismo"
}

export async function getMapPoints(): Promise<MapPoint[]> {
  const supabase = await createClient()

  const [establecimientosRes, organismosRes] = await Promise.all([
    supabase
      .from("establecimientos")
      .select("id, nombre, cue, distrito, fed_a_cargo, nivel, lat, lon")
      .not("lat", "is", null)
      .not("lon", "is", null),
    supabase
      .from("organismos_descentralizados")
      .select("id, nombre, distrito, latitud, longitud")
      .not("latitud", "is", null)
      .not("longitud", "is", null),
  ])

  const establecimientos: MapPoint[] = (establecimientosRes.data || []).map((e) => ({
    id: e.id,
    nombre: e.nombre,
    cue: e.cue,
    distrito: e.distrito,
    fed_a_cargo: e.fed_a_cargo,
    nivel: e.nivel,
    lat: e.lat as number,
    lon: e.lon as number,
    entity_type: "establecimiento" as const,
  }))

  const organismos: MapPoint[] = (organismosRes.data || []).map((o) => ({
    id: o.id,
    nombre: o.nombre,
    cue: null,
    distrito: o.distrito,
    fed_a_cargo: null,
    nivel: null,
    lat: o.latitud as number,
    lon: o.longitud as number,
    entity_type: "organismo" as const,
  }))

  return [...establecimientos, ...organismos]
}
