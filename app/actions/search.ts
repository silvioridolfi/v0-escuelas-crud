"use server"

import { createClient } from "@/lib/supabase/server"
import {
  detectSearchType,
  normalizeText,
  getSchoolTypeSynonyms,
  buildNumberTokenRegex,
  mapNivelToDB, // Importar nueva función de mapeo de niveles
} from "@/lib/search-utils"

type SearchResult = {
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
          "id, cue, nombre, alias, distrito, ciudad, nivel, modalidad, matricula, predio, direccion, fed_a_cargo, es_establecimiento_educativo, contactos!inner(nombre, apellido, telefono, correo)",
        )
        .or(nivelConditions)
        .ilike("nombre", `%${numero}%`)
        .order("nombre", { ascending: true })
        .limit(50)

      if (error) {
        console.error("[v0] Error in nivel_numero search:", error)
        return []
      }

      return (
        data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || []
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
      direccion, fed_a_cargo, es_establecimiento_educativo,
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

      return (
        data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || []
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

      return (
        data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || []
      )
    }

    if (searchType.type === "school_level") {
      const { schoolType } = searchType
      const synonyms = getSchoolTypeSynonyms(schoolType)

      if (synonyms.length > 0) {
        const orConditions = synonyms
          .map((syn) => {
            const normalized = normalizeText(syn)
            return `nombre.ilike.%${normalized}%,alias.ilike.%${normalized}%`
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

        return (
          data?.map((e) => ({
            ...e,
            entity_type: "establecimiento" as const,
          })) || []
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
              const normalized = normalizeText(syn)
              return `nombre.ilike.%${normalized}%,alias.ilike.%${normalized}%`
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

          return filtered.slice(0, 50).map((e) => ({
            ...e,
            entity_type: "establecimiento" as const,
          }))
        }
      }

      const { data: allSchools, error: allError } = await supabase
        .from("establecimientos")
        .select(establishmentFields)
        .limit(500)

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

      return filtered.slice(0, 50).map((e) => ({
        ...e,
        entity_type: "establecimiento" as const,
      }))
    }

    if (searchType.type === "text") {
      const normalized = normalizeText(searchTerm)

      const [establishmentResults, organismoResults] = await Promise.all([
        supabase
          .from("establecimientos")
          .select(establishmentFields)
          .or(
            `nombre.ilike.%${normalized}%,alias.ilike.%${normalized}%,distrito.ilike.%${normalized}%,ciudad.ilike.%${normalized}%`,
          )
          .order("nombre", { ascending: true })
          .limit(50),
        supabase
          .from("organismos_descentralizados")
          .select("*")
          .or(
            `nombre.ilike.%${normalized}%,tipo_organizacion.ilike.%${normalized}%,subtipo_organizacion.ilike.%${normalized}%,distrito.ilike.%${normalized}%`,
          )
          .order("nombre", { ascending: true })
          .limit(50),
      ])

      if (establishmentResults.error) {
        console.error("[v0] Error searching establishments:", establishmentResults.error)
      }

      if (organismoResults.error) {
        console.error("[v0] Error searching organismos:", organismoResults.error)
      }

      const establishments =
        establishmentResults.data?.map((e) => ({
          ...e,
          entity_type: "establecimiento" as const,
        })) || []

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
