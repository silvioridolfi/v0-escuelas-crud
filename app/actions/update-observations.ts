"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateObservations(id: string, observaciones: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("establecimientos")
    .update({
      observaciones: observaciones || null,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/establecimientos/${id}`)
  return { success: true }
}
