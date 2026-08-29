"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createContact(
  cue: number,
  data: {
    nombre: string
    apellido: string
    cargo: string
    telefono: string
    correo: string
    correo_laboral?: string
  },
) {
  const supabase = createAdminClient()

  // Si es el primer contacto que se carga para este establecimiento, lo
  // marcamos como principal automáticamente (así no hace falta un paso extra
  // para escuelas con un solo contacto).
  const { count } = await supabase
    .from("contactos")
    .select("id", { count: "exact", head: true })
    .eq("cue", cue)

  const { error } = await supabase.from("contactos").insert({
    cue,
    nombre: data.nombre || null,
    apellido: data.apellido || null,
    cargo: data.cargo || null,
    telefono: data.telefono || null,
    correo: data.correo || null,
    correo_laboral: data.correo_laboral || null,
    distrito: null,
    fed_a_cargo: null,
    es_principal: (count || 0) === 0,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/[id]`, "page")
  return { success: true }
}

export async function updateContact(
  id: string,
  data: {
    nombre: string
    apellido: string
    cargo: string
    telefono: string
    correo: string
    correo_laboral?: string
  },
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("contactos")
    .update({
      nombre: data.nombre || null,
      apellido: data.apellido || null,
      cargo: data.cargo || null,
      telefono: data.telefono || null,
      correo: data.correo || null,
      correo_laboral: data.correo_laboral || null,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/[id]`, "page")
  return { success: true }
}

export async function deleteContact(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("contactos").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/[id]`, "page")
  return { success: true }
}

// Marca un contacto como principal (el que aparece en las cards del
// buscador). Primero le saca la marca al que la tuviera antes -- nunca
// puede haber dos contactos principales al mismo tiempo para el mismo cue
// (reforzado también por un índice único parcial en la base).
export async function setPrincipalContact(id: string, cue: number) {
  const supabase = createAdminClient()

  const { error: clearError } = await supabase
    .from("contactos")
    .update({ es_principal: false })
    .eq("cue", cue)
    .eq("es_principal", true)

  if (clearError) {
    return { success: false, error: clearError.message }
  }

  const { error: setError } = await supabase.from("contactos").update({ es_principal: true }).eq("id", id)

  if (setError) {
    return { success: false, error: setError.message }
  }

  revalidatePath(`/establecimientos/[id]`, "page")
  return { success: true }
}
