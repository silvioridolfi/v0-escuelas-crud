"use server"

import { createClient } from "@/lib/supabase/server"

export type HistorialEntry = {
  id: string
  seccion: string
  campo: string
  valor_anterior: string | null
  valor_nuevo: string | null
  created_at: string
}

export async function getHistorial(establecimientoId: string): Promise<HistorialEntry[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("historial_cambios")
    .select("id, seccion, campo, valor_anterior, valor_nuevo, created_at")
    .eq("establecimiento_id", establecimientoId)
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) {
    console.error("[v0] Error trayendo historial:", error)
    return []
  }

  return data || []
}
