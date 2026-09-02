"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { logFieldChanges } from "@/lib/historial"

const FIELD_LABELS: Record<string, string> = {
  nivel: "Nivel",
  modalidad: "Modalidad",
  matricula: "Matrícula",
  varones: "Varones",
  mujeres: "Mujeres",
  secciones: "Secciones",
  turnos: "Turnos",
}

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
  const supabase = createAdminClient()

  const { data: before } = await supabase
    .from("establecimientos")
    .select("nivel, modalidad, matricula, varones, mujeres, secciones, turnos")
    .eq("id", id)
    .maybeSingle()

  const after = {
    nivel: data.nivel,
    modalidad: data.modalidad,
    matricula: Number.parseInt(data.matricula) || 0,
    varones: Number.parseInt(data.varones) || 0,
    mujeres: Number.parseInt(data.mujeres) || 0,
    secciones: Number.parseInt(data.secciones) || 0,
    turnos: data.turnos || null,
  }

  const { error } = await supabase.from("establecimientos").update(after).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  if (before) {
    await logFieldChanges(supabase, {
      establecimientoId: id,
      seccion: "Académico",
      before,
      after,
      labels: FIELD_LABELS,
    })
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
