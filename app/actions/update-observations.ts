"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { logFieldChanges } from "@/lib/historial"

export async function updateObservations(id: string, observaciones: string) {
  const supabase = createAdminClient()

  const { data: before } = await supabase.from("establecimientos").select("observaciones").eq("id", id).maybeSingle()

  const after = { observaciones: observaciones || null }

  const { data: updated, error } = await supabase.from("establecimientos").update(after).eq("id", id).select("id")

  if (error) {
    return { success: false, error: error.message }
  }

  if (!updated || updated.length === 0) {
    return { success: false, error: "No se encontró el establecimiento a actualizar" }
  }

  if (before) {
    await logFieldChanges(supabase, {
      establecimientoId: id,
      seccion: "Observaciones",
      before,
      after,
      labels: { observaciones: "Observaciones" },
    })
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
