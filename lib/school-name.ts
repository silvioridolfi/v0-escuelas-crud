/**
 * Splits an establishment's full name into two display lines.
 *
 * Names are stored as a single string combining the institution type/number
 * and its assigned name, e.g. `ESCUELA DE EDUCACIÓN PRIMARIA N° 10 JUAN MARTÍN DE PUEYRREDON`.
 * This splits that into:
 *   primary:   "ESCUELA DE EDUCACIÓN PRIMARIA N° 10"
 *   secondary: "JUAN MARTÍN DE PUEYRREDON"
 *
 * If no institution number is found, the full name is returned as the primary
 * line and secondary is null.
 */
export function splitEstablishmentName(nombre: string | null | undefined): {
  primary: string
  secondary: string | null
} {
  const trimmed = (nombre ?? "").trim()

  if (!trimmed) {
    return { primary: "", secondary: null }
  }

  // Matches things like "N° 10", "Nº 5", "N*3", "N 12", "Nro. 8" followed by the assigned name.
  const match = trimmed.match(/^(.*?N(?:ro)?[°ºª*]?\.?\s*\d+)\s+(.+)$/i)

  if (match) {
    const primary = match[1].trim()
    const secondary = match[2].trim().replace(/^["“]|["”]$/g, "")

    if (secondary.length > 0) {
      return { primary, secondary }
    }
  }

  return { primary: trimmed, secondary: null }
}
