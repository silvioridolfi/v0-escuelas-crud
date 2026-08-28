"use server"

import { createClient } from "@/lib/supabase/server"
import { attachSharedPredioInfo, type SearchResult } from "@/app/actions/search"

export type QuickFilterKey = "cerradas" | "contexto" | "sin_fed" | "sin_contacto" | "nuevos"

export const QUICK_FILTERS: { key: QuickFilterKey; label: string }[] = [
  { key: "cerradas", label: "Escuelas cerradas" },
  { key: "contexto", label: "Contexto de encierro" },
  { key: "sin_fed", label: "Sin FED asignado" },
  { key: "sin_contacto", label: "Sin contacto" },
  { key: "nuevos", label: "Nuevos establecimientos" },
]

const establishmentFields = `
  id, cue, nombre, alias, distrito, ciudad, nivel, modalidad, matricula, secciones, turnos, predio, 
  direccion, fed_a_cargo, es_establecimiento_educativo, tipo_establecimiento, plan_enlace, plan_piso_tecnologico, lat, lon,
  dependencia_completa
`

export async function getQuickFilterCount(filter: QuickFilterKey): Promise<number> {
  const supabase = await createClient()

  switch (filter) {
    case "cerradas": {
      const { count } = await supabase
        .from("establecimientos")
        .select("id", { count: "exact", head: true })
        .eq("tipo_establecimiento", "Escuela cerrada")
      return count || 0
    }
    case "contexto": {
      const { count } = await supabase
        .from("establecimientos")
        .select("id", { count: "exact", head: true })
        .eq("tipo_establecimiento", "Contexto de encierro")
      return count || 0
    }
    case "sin_fed": {
      const { count } = await supabase
        .from("establecimientos")
        .select("id", { count: "exact", head: true })
        .is("fed_a_cargo", null)
        .eq("es_establecimiento_educativo", true)
      return count || 0
    }
    case "nuevos": {
      const { count } = await supabase
        .from("establecimientos")
        .select("id", { count: "exact", head: true })
        .gt("created_at", "2025-06-01")
      return count || 0
    }
    case "sin_contacto": {
      const ids = await getSinContactoIds(supabase)
      return ids.length
    }
  }
}

async function getSinContactoIds(supabase: Awaited<ReturnType<typeof createClient>>): Promise<number[]> {
  const { data: conCargados } = await supabase
    .from("contactos")
    .select("cue")
    .or("correo.not.is.null,telefono.not.is.null")

  const cuesConDatos = new Set((conCargados || []).map((c) => c.cue))

  const { data: todosCues } = await supabase.from("establecimientos").select("cue").eq("es_establecimiento_educativo", true)

  return (todosCues || []).map((e) => e.cue).filter((cue) => !cuesConDatos.has(cue))
}

export async function getQuickFilterResults(filter: QuickFilterKey): Promise<SearchResult[]> {
  const supabase = await createClient()

  let query = supabase.from("establecimientos").select(establishmentFields)

  switch (filter) {
    case "cerradas":
      query = query.eq("tipo_establecimiento", "Escuela cerrada")
      break
    case "contexto":
      query = query.eq("tipo_establecimiento", "Contexto de encierro")
      break
    case "sin_fed":
      query = query.is("fed_a_cargo", null).eq("es_establecimiento_educativo", true)
      break
    case "nuevos":
      query = query.gt("created_at", "2025-06-01")
      break
    case "sin_contacto": {
      const cues = await getSinContactoIds(supabase)
      if (cues.length === 0) return []
      query = query.in("cue", cues)
      break
    }
  }

  const { data, error } = await query.order("nombre", { ascending: true })

  if (error) {
    console.error("[v0] Error en filtro rápido:", error)
    return []
  }

  const results = (data || []).map((r) => ({ ...r, entity_type: "establecimiento" as const }))
  return attachSharedPredioInfo(results as SearchResult[], supabase)
}
