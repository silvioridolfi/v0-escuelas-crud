"use server"

import { createClient } from "@/lib/supabase/server"

export async function createEstablishment(data: {
  cue: number
  predio: number | null
  nombre: string
  distrito: string
  ciudad: string
  direccion: string
  nivel: string
  modalidad: string
  fed_a_cargo: string
}) {
  const supabase = await createClient()

  const { data: existing } = await supabase.from("establecimientos").select("id").eq("cue", data.cue).single()

  if (existing) {
    return { success: false, error: "Ya existe un establecimiento con ese CUE" }
  }

  const { data: inserted, error } = await supabase
    .from("establecimientos")
    .insert({
      cue: data.cue,
      predio: data.predio,
      nombre: data.nombre,
      distrito: data.distrito,
      ciudad: data.ciudad,
      direccion: data.direccion,
      nivel: data.nivel,
      modalidad: data.modalidad,
      fed_a_cargo: data.fed_a_cargo,
      // Default values for required fields
      alias: null,
      lat: null,
      lon: null,
      tipo_establecimiento: "",
      ambito: "",
      matricula: 0,
      varones: 0,
      mujeres: 0,
      secciones: 0,
      turnos: null,
      plan_enlace: null,
      listado_conexion_internet: null,
      plan_piso_tecnologico: null,
      observaciones: null,
    })
    .select("id")
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, id: inserted.id }
}
