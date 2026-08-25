"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { logFieldChanges } from "@/lib/historial"

const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre",
  alias: "Alias",
  distrito: "Distrito",
  ciudad: "Ciudad",
  direccion: "Dirección",
  predio: "Predio",
  lat: "Latitud",
  lon: "Longitud",
  fed_a_cargo: "FED a cargo",
  tipo_establecimiento: "Tipo de establecimiento",
  ambito: "Ámbito",
}

export async function updateGeneral(
  id: string,
  data: {
    nombre: string
    alias: string
    distrito: string
    ciudad: string
    direccion: string
    predio: number | null
    lat: string
    lon: string
    fed_a_cargo: string | null
    tipo_establecimiento: string
    ambito: string
  },
) {
  const supabase = createAdminClient()

  const { data: before } = await supabase
    .from("establecimientos")
    .select("nombre, alias, distrito, ciudad, direccion, predio, lat, lon, fed_a_cargo, tipo_establecimiento, ambito")
    .eq("id", id)
    .single()

  const after = {
    nombre: data.nombre,
    alias: data.alias || null,
    distrito: data.distrito,
    ciudad: data.ciudad,
    direccion: data.direccion,
    predio: data.predio,
    lat: data.lat ? Number.parseFloat(data.lat) : null,
    lon: data.lon ? Number.parseFloat(data.lon) : null,
    fed_a_cargo: data.fed_a_cargo,
    tipo_establecimiento: data.tipo_establecimiento,
    ambito: data.ambito,
  }

  const { error } = await supabase.from("establecimientos").update(after).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  if (before) {
    await logFieldChanges(supabase, {
      establecimientoId: id,
      seccion: "General",
      before,
      after,
      labels: FIELD_LABELS,
    })
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
