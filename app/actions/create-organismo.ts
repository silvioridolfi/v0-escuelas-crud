"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type CreateOrganismoData = {
  codigo: string
  tipo_organizacion: string
  dependencia: string
  nombre: string | null
  distrito: string
  domicilio: string
  localidad: string
  telefono: string | null
  contacto_nombre: string | null
  contacto_apellido: string | null
  contacto_cargo: string | null
  email: string | null
}

export async function createOrganismoDescentralizado(data: CreateOrganismoData) {
  const supabase = await createClient()

  // Verificar si el código ya existe
  const { data: existing } = await supabase
    .from("organismos_descentralizados")
    .select("codigo")
    .eq("codigo", data.codigo)
    .maybeSingle()

  if (existing) {
    return {
      success: false,
      error: `Ya existe un organismo con el código ${data.codigo}`,
    }
  }

  // Crear el organismo
  const { data: newOrganismo, error } = await supabase
    .from("organismos_descentralizados")
    .insert({
      codigo: data.codigo,
      tipo_organizacion: data.tipo_organizacion,
      dependencia: data.dependencia,
      nombre: data.nombre,
      distrito: data.distrito,
      domicilio: data.domicilio,
      localidad: data.localidad,
      telefono: data.telefono,
      contacto_nombre: data.contacto_nombre,
      contacto_apellido: data.contacto_apellido,
      contacto_cargo: data.contacto_cargo,
      email: data.email,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating organismo:", error)
    return {
      success: false,
      error: "Error al crear el organismo descentralizado",
    }
  }

  revalidatePath("/")
  revalidatePath("/organismos")

  return {
    success: true,
    id: newOrganismo.id,
  }
}
