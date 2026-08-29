"use server"

import { createClient } from "@/lib/supabase/server"
import { attachSharedPredioInfo, type SearchResult } from "@/app/actions/search"
import type { QuickFilterKey } from "@/lib/quick-filters-config"

const establishmentFields = `
  id, cue, nombre, alias, distrito, ciudad, nivel, modalidad, matricula, secciones, turnos, predio, 
  direccion, fed_a_cargo, es_establecimiento_educativo, tipo_establecimiento, plan_enlace, plan_piso_tecnologico, lat, lon,
  dependencia_completa
`

export async function getQuickFilterCount(filter: QuickFilterKey): Promise<number> {
  const counts = await getAllQuickFilterCounts()
  return counts[filter]
}

// Trae los 5 contadores de una sola pasada: 2 consultas livianas (solo los
// campos necesarios) en vez de 7 llamadas separadas (una por filtro, más 2
// extra para "sin contacto"). Se calcula todo en memoria a partir de esas
// 2 respuestas.
export async function getAllQuickFilterCounts(): Promise<Record<QuickFilterKey, number>> {
  const supabase = await createClient()

  const cutoffNuevos = "2025-06-01"

  const [estRes, contactRes] = await Promise.all([
    supabase
      .from("establecimientos")
      .select("cue, tipo_establecimiento, fed_a_cargo, created_at, es_establecimiento_educativo"),
    supabase.from("contactos").select("cue").or("correo.not.is.null,telefono.not.is.null"),
  ])

  const establecimientos = estRes.data || []
  const cuesConContacto = new Set((contactRes.data || []).map((c) => c.cue))

  let cerradas = 0
  let contexto = 0
  let sinFed = 0
  let nuevos = 0
  let sinContacto = 0

  for (const e of establecimientos) {
    if (e.tipo_establecimiento === "Escuela cerrada") cerradas++
    if (e.tipo_establecimiento === "Contexto de encierro") contexto++
    if (e.es_establecimiento_educativo && !e.fed_a_cargo) sinFed++
    if (e.created_at && e.created_at > cutoffNuevos) nuevos++
    if (e.es_establecimiento_educativo && !cuesConContacto.has(e.cue)) sinContacto++
  }

  return { cerradas, contexto, sin_fed: sinFed, nuevos, sin_contacto: sinContacto }
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
