"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type UpdateOrganismoData = {
  codigo: string
  subtipo_organizacion: string | null // Changed from tipo_organizacion to subtipo_organizacion
  nombre: string | null
  distrito: string
  domicilio: string
  localidad: string
  telefono: string | null
  contacto_nombre: string | null
  contacto_apellido: string | null
  contacto_cargo: string | null
  email: string | null
  latitud: number | null
  longitud: number | null
  observaciones: string | null
}

export async function updateOrganismoDescentralizado(id: string, data: UpdateOrganismoData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("organismos_descentralizados")
    .update({
      codigo: data.codigo,
      subtipo_organizacion: data.subtipo_organizacion,
      nombre: data.nombre,
      distrito: data.distrito,
      domicilio: data.domicilio,
      localidad: data.localidad,
      telefono: data.telefono,
      contacto_nombre: data.contacto_nombre,
      contacto_apellido: data.contacto_apellido,
      contacto_cargo: data.contacto_cargo,
      email: data.email,
      latitud: data.latitud,
      longitud: data.longitud,
      observaciones: data.observaciones,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating organismo:", error)
    return {
      success: false,
      error: "Error al actualizar el organismo",
    }
  }

  revalidatePath(`/organismos/${id}`)
  revalidatePath("/")

  return {
    success: true,
  }
}
