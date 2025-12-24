"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteEstablishment(id: string) {
  try {
    const supabase = await createClient()

    // Delete the establishment
    const { error } = await supabase.from("establecimientos").delete().eq("id", id)

    if (error) {
      console.error("Error deleting establishment:", error)
      return { success: false, error: error.message }
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
