"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createContact(
  cue: number,
  data: {
    nombre: string
    apellido: string
    cargo: string
    telefono: string
    correo: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase.from("contactos").insert({
    cue,
    nombre: data.nombre || null,
    apellido: data.apellido || null,
    cargo: data.cargo || null,
    telefono: data.telefono || null,
    correo: data.correo || null,
    distrito: null,
    fed_a_cargo: null,
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
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("contactos")
    .update({
      nombre: data.nombre || null,
      apellido: data.apellido || null,
      cargo: data.cargo || null,
      telefono: data.telefono || null,
      correo: data.correo || null,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/[id]`, "page")
  return { success: true }
}

export async function deleteContact(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("contactos").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/[id]`, "page")
  return { success: true }
}
