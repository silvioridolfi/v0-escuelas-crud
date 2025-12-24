"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateConnectivity(
  id: string,
  data: {
    plan_enlace: string
    pnce_estado: string
    pba_grupo_1_estado: string
    pba_2019_estado: string
    pba_grupo_2_a_estado: string
    estado_instalacion_pba: string
    plan_piso_tecnologico: string
    tipo_mejora: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("establecimientos")
    .update({
      plan_enlace: data.plan_enlace || null,
      pnce_estado: data.pnce_estado || null,
      pba_grupo_1_estado: data.pba_grupo_1_estado || null,
      pba_2019_estado: data.pba_2019_estado || null,
      pba_grupo_2_a_estado: data.pba_grupo_2_a_estado || null,
      estado_instalacion_pba: data.estado_instalacion_pba || null,
      plan_piso_tecnologico: data.plan_piso_tecnologico || null,
      tipo_mejora: data.tipo_mejora || null,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
