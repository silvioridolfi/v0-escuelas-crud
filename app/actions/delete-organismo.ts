"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function deleteOrganismo(id: string) {
  try {
    const supabase = createAdminClient()

    // Delete the organismo
    const { data: deleted, error } = await supabase
      .from("organismos_descentralizados")
      .delete()
      .eq("id", id)
      .select("id")

    if (error) {
      console.error("Error deleting organismo:", error)
      return { success: false, error: error.message }
    }

    if (!deleted || deleted.length === 0) {
      return { success: false, error: "No se encontró el organismo a eliminar" }
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
