"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateConnectivity(
  id: string,
  data: {
    plan_enlace: string
    subplan_enlace: string
    fecha_inicio_conectividad: string
    mb: string
    listado_conexion_internet: string
    pnce_estado: string
    proveedor_internet_pnce: string
    fecha_instalacion_pnce: string
    pnce_fecha_mejora: string
    pnce_tipo_mejora: string
    pba_grupo_1_estado: string
    pba_grupo_1_proveedor_internet: string
    pba_grupo_1_fecha_instalacion: string
    reclamos_grupo_1_ani: string
    pba_2019_estado: string
    pba_2019_proveedor_internet: string
    pba_2019_fecha_instalacion: string
    pba_grupo_2_a_estado: string
    pba_grupo_2_a_proveedor_internet: string
    pba_grupo_2_a_fecha_instalacion: string
    pba_grupo_2_a_fecha_mejora: string
    pba_grupo_2_a_tipo_mejora: string
    estado_instalacion_pba: string
    proveedor_asignado_pba: string
    plan_piso_tecnologico: string
    tipo_piso_instalado: string
    fecha_terminado_piso_tecnologico_cue: string
    proveedor_piso_tecnologico_cue: string
    fecha_mejora: string
    tipo_mejora: string
  },
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("establecimientos")
    .update({
      plan_enlace: data.plan_enlace || null,
      subplan_enlace: data.subplan_enlace || null,
      fecha_inicio_conectividad: data.fecha_inicio_conectividad || null,
      mb: data.mb || null,
      listado_conexion_internet: data.listado_conexion_internet || null,
      pnce_estado: data.pnce_estado || null,
      proveedor_internet_pnce: data.proveedor_internet_pnce || null,
      fecha_instalacion_pnce: data.fecha_instalacion_pnce || null,
      pnce_fecha_mejora: data.pnce_fecha_mejora || null,
      pnce_tipo_mejora: data.pnce_tipo_mejora || null,
      pba_grupo_1_estado: data.pba_grupo_1_estado || null,
      pba_grupo_1_proveedor_internet: data.pba_grupo_1_proveedor_internet || null,
      pba_grupo_1_fecha_instalacion: data.pba_grupo_1_fecha_instalacion || null,
      reclamos_grupo_1_ani: data.reclamos_grupo_1_ani || null,
      pba_2019_estado: data.pba_2019_estado || null,
      pba_2019_proveedor_internet: data.pba_2019_proveedor_internet || null,
      pba_2019_fecha_instalacion: data.pba_2019_fecha_instalacion || null,
      pba_grupo_2_a_estado: data.pba_grupo_2_a_estado || null,
      pba_grupo_2_a_proveedor_internet: data.pba_grupo_2_a_proveedor_internet || null,
      pba_grupo_2_a_fecha_instalacion: data.pba_grupo_2_a_fecha_instalacion || null,
      pba_grupo_2_a_fecha_mejora: data.pba_grupo_2_a_fecha_mejora || null,
      pba_grupo_2_a_tipo_mejora: data.pba_grupo_2_a_tipo_mejora || null,
      estado_instalacion_pba: data.estado_instalacion_pba || null,
      proveedor_asignado_pba: data.proveedor_asignado_pba || null,
      plan_piso_tecnologico: data.plan_piso_tecnologico || null,
      tipo_piso_instalado: data.tipo_piso_instalado || null,
      fecha_terminado_piso_tecnologico_cue: data.fecha_terminado_piso_tecnologico_cue || null,
      proveedor_piso_tecnologico_cue: data.proveedor_piso_tecnologico_cue || null,
      fecha_mejora: data.fecha_mejora || null,
      tipo_mejora: data.tipo_mejora || null,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
