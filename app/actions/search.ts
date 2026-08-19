"use server"

import { createClient } from "@/lib/supabase/server"
import {
  detectSearchType,
  normalizeText,
  getSchoolTypeSynonyms,
  buildNumberTokenRegex,
  mapNivelToDB, // Importar nueva función de mapeo de niveles
} from "@/lib/search-utils"

export type SearchResult = {
  id: string
  // Establishment fields
  cue?: number
  predio?: number
  nombre: string
  distrito: string
  ciudad: string
  direccion: string
  nivel?: string
  modalidad?: string
  matricula?: number
  fed_a_cargo?: string
  es_establecimiento_educativo?: boolean
  plan_enlace?: string | null
  plan_piso_tecnologico?: string | null
  lat?: number | null
  lon?: number | null
  sharedWith?: Array<{ id: string; cue: number; nombre: string }>
  // Organismo fields
  codigo?: string
  tipo_organizacion?: string
  subtipo_organizacion?: string
  telefono?: string
  email?: string
  contacto_nombre?: string
  contacto_apellido?: string
  contacto_cargo?: string
  // Contact info
  contactos?: Array<{
    nombre: string
    apellido: string
    telefono: string
    correo: string
  }>
  // Type discriminator
  entity_type: "establecimiento" | "organismo"
}

/**
 * For establecimiento results that share a non-null/non-zero "predio" number with
 * another establecimiento, attaches the list of sibling establishments (id, cue, nombre)
 * so the UI can surface a "shares this predio with..." indicator.
 */
async function attachSharedPredioInfo(
  results: SearchResult[],
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<SearchResult[]> {
  const predios = Array.from(
    new Set(
      results
        .filter((r) => r.entity_type === "establecimiento" && r.predio)
        .map((r) => r.predio as number)
        .filter((predio) => predio > 0),
    ),
  )

  if (predios.length === 0) {
    return results
  }

  const { data: siblings, error } = await supabase
    .from("establecimientos")
    .select("id, cue, nombre, predio")
    .in("predio", predios)

  if (error || !siblings) {
    console.error("[v0] Error fetching shared-predio siblings:", error)
    return results
  }

  const siblingsByPredio = new Map<number, Array<{ id: string; cue: number; nombre: string }>>()
  for (const sibling of siblings) {
    if (!sibling.predio) continue
    const group = siblingsByPredio.get(sibling.predio) || []
    group.push({ id: sibling.id, cue: sibling.cue, nombre: sibling.nombre })
    siblingsByPredio.set(sibling.predio, group)
  }

  return results.map((r) => {
    if (r.entity_type !== "establecimiento" || !r.predio) {
      return r
    }
    const group = siblingsByPredio.get(r.predio) || []
    const sharedWith = group.filter((s) => s.id !== r.id)
    return sharedWith.length > 0 ? { ...r, sharedWith } : r
  })
}

export async function searchEstablecimientos(searchTerm: string): Promise<SearchResult[]> {
  if (!searchTerm.trim()) {
    return []
  }

  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Error: Supabase client could not be created. Check environment variables.")
      return []
    }

    const searchType = detectSearchType(searchTerm)

    console.log("[v0] Search type detected:", searchType)

    if (searchType.type === "nivel_numero") {
      const { nivel, numero } = searchType
      const nivelesDB = mapNivelToDB(nivel)

      console.log("[v0] Nivel+Numero search:", { nivel, numero, nivelesDB })

      // Construir condición OR para los niveles mapeados
      const nivelConditions = nivelesDB.map((n) => `nivel.ilike.%${n}%`).join(",")

      const { data, error } = await supabase
        .from("establecimientos")
        .select(
          "id, cue, nombre, alias, distrito, ciudad, nivel, modalidad, matricula, predio, direccion, fed_a_cargo, es_establecimiento_educativo, plan_enlace, plan_piso_tecnologico, lat, lon, contactos!inner(nombre, apellido, telefono, correo)",
        )
        .or(nivelConditions)
        .ilike("nombre", `%${numero}%`)
        .order("nombre", { ascending: true })
        .limit(50)

      if (error) {
        console.error("[v0] Error in nivel_numero search:", error)
        return []
      }

      return attachSharedPredioInfo(
        data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || [],
        supabase,
      )
    }

    if (searchType.type === "codigo_organismo") {
      const { data, error } = await supabase
        .from("organismos_descentralizados")
        .select("*")
        .eq("codigo", searchType.value)
        .limit(1)

      if (error) {
        console.error("[v0] Error searching organismo by code:", error)
        return []
      }

      return (
        data?.map((org) => ({
          id: org.id,
          codigo: org.codigo,
          nombre: org.nombre,
          tipo_organizacion: org.tipo_organizacion,
          subtipo_organizacion: org.subtipo_organizacion,
          distrito: org.distrito || "",
          ciudad: org.localidad || "",
          direccion: org.domicilio || "",
          telefono: org.telefono,
          email: org.email,
          contacto_nombre: org.contacto_nombre,
          contacto_apellido: org.contacto_apellido,
          contacto_cargo: org.contacto_cargo,
          entity_type: "organismo" as const,
        })) || []
      )
    }

    const establishmentFields = `
      id, cue, nombre, alias, distrito, ciudad, nivel, modalidad, matricula, predio, 
      direccion, fed_a_cargo, es_establecimiento_educativo, plan_enlace, plan_piso_tecnologico, lat, lon,
      contactos!inner(nombre, apellido, telefono, correo)
    `

    if (searchType.type === "cue") {
      const { data, error } = await supabase
        .from("establecimientos")
        .select(establishmentFields)
        .eq("cue", searchType.value)
        .limit(1)

      if (error) {
        console.error("[v0] Error searching by CUE:", error)
        return []
      }

      return attachSharedPredioInfo(
        data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || [],
        supabase,
      )
    }

    if (searchType.type === "predio") {
      const { data, error } = await supabase
        .from("establecimientos")
        .select(establishmentFields)
        .eq("predio", searchType.value)
        .order("nombre", { ascending: true })
        .limit(50)

      if (error) {
        console.error("[v0] Error searching by PREDIO:", error)
        return []
      }

      return attachSharedPredioInfo(
        data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || [],
        supabase,
      )
    }

    if (searchType.type === "school_level") {
      const { schoolType } = searchType
      const synonyms = getSchoolTypeSynonyms(schoolType)

      if (synonyms.length > 0) {
        const orConditions = synonyms
          .map((syn) => {
            // Use the synonym as-is (accented and unaccented variants are both
            // present in the synonym list). Stripping accents here would prevent
            // matching DB values that keep the accent (e.g. "Técnica").
            return `nombre.ilike.%${syn}%,alias.ilike.%${syn}%`
          })
          .join(",")

        const { data, error } = await supabase
          .from("establecimientos")
          .select(establishmentFields)
          .or(orConditions)
          .order("nombre", { ascending: true })
          .limit(50)

        if (error) {
          console.error("[v0] Error searching by school level:", error)
          return []
        }

        return attachSharedPredioInfo(
          data?.map((e) => ({
            ...e,
            entity_type: "establecimiento" as const,
          })) || [],
          supabase,
        )
      }
    }

    if (searchType.type === "school_number") {
      const { schoolType, number } = searchType
      const numberRegex = buildNumberTokenRegex(number)

      if (schoolType) {
        const synonyms = getSchoolTypeSynonyms(schoolType)

        if (synonyms.length > 0) {
          const orConditions = synonyms
            .map((syn) => {
              // Use the synonym as-is so accented variants (e.g. "Técnica")
              // still match against the DB values that keep the accent.
              return `nombre.ilike.%${syn}%,alias.ilike.%${syn}%`
            })
            .join(",")

          const { data: typeMatches, error: typeError } = await supabase
            .from("establecimientos")
            .select(establishmentFields)
            .or(orConditions)
            .limit(200)

          if (typeError) {
            console.error("[v0] Error searching by school type:", typeError)
            return []
          }

          const regex = new RegExp(numberRegex, "i")
          const filtered = (typeMatches || []).filter((school) => {
            const nombreNorm = normalizeText(school.nombre || "")
            const aliasNorm = normalizeText(school.alias || "")
            return regex.test(nombreNorm) || regex.test(aliasNorm)
          })

          return attachSharedPredioInfo(
            filtered.slice(0, 50).map((e) => ({
              ...e,
              entity_type: "establecimiento" as const,
            })),
            supabase,
          )
        }
      }

      // Para una búsqueda numérica sin tipo (por ejemplo, "980"), limitar la
      // consulta a nombres/alias que contengan ese número evita perder jardines
      // válidos cuando quedan fuera del primer lote de registros.
      const { data: allSchools, error: allError } = await supabase
        .from("establecimientos")
        .select(establishmentFields)
        .or(`nombre.ilike.%${number}%,alias.ilike.%${number}%`)
        .order("nombre", { ascending: true })
        .limit(1000)

      if (allError) {
        console.error("[v0] Error searching schools:", allError)
        return []
      }

      const regex = new RegExp(numberRegex, "i")
      const filtered = (allSchools || []).filter((school) => {
        const nombreNorm = normalizeText(school.nombre || "")
        const aliasNorm = normalizeText(school.alias || "")
        return regex.test(nombreNorm) || regex.test(aliasNorm)
      })

      return attachSharedPredioInfo(
        filtered.slice(0, 50).map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })),
        supabase,
      )
    }

    if (searchType.type === "text") {
      const raw = searchTerm.trim()
      const normalized = normalizeText(searchTerm)
      // Postgres ILIKE is case-insensitive but not accent-insensitive, so a term
      // without accents (e.g. "tecnica") won't match DB values that keep the
      // accent (e.g. "Técnica"). Search both the raw term and the accent-stripped
      // version to cover both cases; skip the duplicate query when they're equal.
      const terms = raw.toLowerCase() === normalized ? [raw] : [raw, normalized]

      const establishmentOr = terms
        .flatMap((term) => [
          `nombre.ilike.%${term}%`,
          `alias.ilike.%${term}%`,
          `distrito.ilike.%${term}%`,
          `ciudad.ilike.%${term}%`,
        ])
        .join(",")

      const organismoOr = terms
        .flatMap((term) => [
          `nombre.ilike.%${term}%`,
          `tipo_organizacion.ilike.%${term}%`,
          `subtipo_organizacion.ilike.%${term}%`,
          `distrito.ilike.%${term}%`,
        ])
        .join(",")

      const [establishmentResults, organismoResults] = await Promise.all([
        supabase
          .from("establecimientos")
          .select(establishmentFields)
          .or(establishmentOr)
          .order("nombre", { ascending: true })
          .limit(50),
        supabase
          .from("organismos_descentralizados")
          .select("*")
          .or(organismoOr)
          .order("nombre", { ascending: true })
          .limit(50),
      ])

      if (establishmentResults.error) {
        console.error("[v0] Error searching establishments:", establishmentResults.error)
      }

      if (organismoResults.error) {
        console.error("[v0] Error searching organismos:", organismoResults.error)
      }

      const establishments = await attachSharedPredioInfo(
        establishmentResults.data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || [],
        supabase,
      )

      const organismos =
        organismoResults.data?.map((org) => ({
          id: org.id,
          codigo: org.codigo,
          nombre: org.nombre,
          tipo_organizacion: org.tipo_organizacion,
          subtipo_organizacion: org.subtipo_organizacion,
          distrito: org.distrito || "",
          ciudad: org.localidad || "",
          direccion: org.domicilio || "",
          telefono: org.telefono,
          email: org.email,
          contacto_nombre: org.contacto_nombre,
          contacto_apellido: org.contacto_apellido,
          contacto_cargo: org.contacto_cargo,
          entity_type: "organismo" as const,
        })) || []

      return [...establishments, ...organismos]
    }

    return []
  } catch (error) {
    console.error("[v0] Unexpected error in searchEstablecimientos:", error)
    console.error("[v0] Stack trace:", error instanceof Error ? error.stack : "No stack trace")

    // Retornar array vacío en lugar de lanzar excepción
    return []
  }
}

/**
 * Fetches every organismo descentralizado, mapped to the same shape used in search results,
 * so it can be rendered with the SearchResults card grid (e.g. from the dashboard metrics).
 */
export async function getAllOrganismos(): Promise<SearchResult[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("organismos_descentralizados")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching all organismos:", error)
      return []
    }

    return (
      data?.map((org) => ({
        id: org.id,
        codigo: org.codigo,
        nombre: org.nombre,
        tipo_organizacion: org.tipo_organizacion,
        subtipo_organizacion: org.subtipo_organizacion,
        distrito: org.distrito || "",
        ciudad: org.localidad || "",
        direccion: org.domicilio || "",
        telefono: org.telefono,
        email: org.email,
        contacto_nombre: org.contacto_nombre,
        contacto_apellido: org.contacto_apellido,
        contacto_cargo: org.contacto_cargo,
        entity_type: "organismo" as const,
      })) || []
    )
  } catch (error) {
    console.error("[v0] Unexpected error in getAllOrganismos:", error)
    return []
  }
}
