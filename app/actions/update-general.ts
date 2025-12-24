"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateGeneral(
  id: string,
  data: {
    nombre: string
    alias: string
    distrito: string
    ciudad: string
    direccion: string
    lat: string
    lon: string
    fed_a_cargo: string
    tipo_establecimiento: string
    ambito: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("establecimientos")
    .update({
      nombre: data.nombre,
      alias: data.alias || null,
      distrito: data.distrito,
      ciudad: data.ciudad,
      direccion: data.direccion,
      lat: data.lat ? Number.parseFloat(data.lat) : null,
      lon: data.lon ? Number.parseFloat(data.lon) : null,
      fed_a_cargo: data.fed_a_cargo,
      tipo_establecimiento: data.tipo_establecimiento,
      ambito: data.ambito,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
