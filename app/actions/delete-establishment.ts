"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function deleteEstablishment(id: string) {
  try {
    const supabase = createAdminClient()

    // Delete the establishment
    const { data: deleted, error } = await supabase.from("establecimientos").delete().eq("id", id).select("id")

    if (error) {
      console.error("Error deleting establishment:", error)
      return { success: false, error: error.message }
    }

    if (!deleted || deleted.length === 0) {
      return { success: false, error: "No se encontró el establecimiento a eliminar" }
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/establecimientos")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteEstablishment:", error)
    return { success: false, error: "Error al eliminar el establecimiento" }
  }
}
