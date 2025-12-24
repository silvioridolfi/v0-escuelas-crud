"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateAcademic(
  id: string,
  data: {
    nivel: string
    modalidad: string
    matricula: string
    varones: string
    mujeres: string
    secciones: string
    turnos: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("establecimientos")
    .update({
      nivel: data.nivel,
      modalidad: data.modalidad,
      matricula: Number.parseInt(data.matricula) || 0,
      varones: Number.parseInt(data.varones) || 0,
      mujeres: Number.parseInt(data.mujeres) || 0,
      secciones: Number.parseInt(data.secciones) || 0,
      turnos: data.turnos || null,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
