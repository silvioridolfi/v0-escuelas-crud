"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteOrganismo(id: string) {
  try {
    const supabase = await createClient()

    // Delete the organismo
    const { error } = await supabase.from("organismos_descentralizados").delete().eq("id", id)

    if (error) {
      console.error("Error deleting organismo:", error)
      return { success: false, error: error.message }
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/organismos")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteOrganismo:", error)
    return { success: false, error: "Error al eliminar el organismo" }
  }
}
