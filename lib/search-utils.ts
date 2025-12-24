/**
 * Normaliza texto removiendo tildes/acentos y convirtiendo a minúsculas
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim()
}

/**
 * Detecta el tipo de búsqueda basado en el input
 */
export type SearchType =
  | { type: "cue"; value: string }
  | { type: "predio"; value: string }
  | { type: "codigo_organismo"; value: string } // Added for JR/JD codes
  | { type: "nivel_numero"; nivel: string; numero: string }
  | { type: "school_number"; schoolType: string; number: string }
  | { type: "school_level"; schoolType: string }
  | { type: "text"; value: string }

export function detectSearchType(input: string): SearchType {
  const trimmed = input.trim()

  if (/^(jr|jd)\d+$/i.test(trimmed)) {
    return { type: "codigo_organismo", value: trimmed.toLowerCase() }
  }

  // Solo números
  if (/^\d+$/.test(trimmed)) {
    if (trimmed.length === 8) {
      return { type: "cue", value: trimmed }
    }
    if (trimmed.length === 6) {
      return { type: "predio", value: trimmed }
    }
    if (trimmed.length >= 1 && trimmed.length <= 4) {
      return { type: "school_number", schoolType: "", number: trimmed }
    }
  }

  // Soporta niveles educativos estándar de Buenos Aires
  const nivelNumeroPattern =
    /^(primaria?|secundaria?|inicial|jardin|jardín|tecnica?|técnica?|especial|adultos?|superior|formaci[oó]n\s+profesional)\s+n?°?\s*(\d{1,4})$/i

  const matchNivelNumero = trimmed.match(nivelNumeroPattern)

  if (matchNivelNumero) {
    const nivel = normalizeText(matchNivelNumero[1])
    const numero = matchNivelNumero[2]
    return { type: "nivel_numero", nivel, numero }
  }

  // Búsqueda tipo "secundaria 8", "tecnica 5", etc. (patrón anterior mantenido como fallback)
  const schoolTypeWithNumberPattern =
    /^(secundaria|primaria|tecnica|técnica|jardin|jardín|infantes|especial|adultos|cfp|centro|ep|ees|ji|eee|cea|cens|tec)\s+(\d{1,4})$/i
  const matchWithNumber = trimmed.match(schoolTypeWithNumberPattern)

  if (matchWithNumber) {
    const schoolType = normalizeText(matchWithNumber[1])
    const number = matchWithNumber[2]
    return { type: "school_number", schoolType, number }
  }

  const schoolLevelPattern =
    /^(secundaria|primaria|tecnica|técnica|jardin|jardín|infantes|especial|adultos|cfp|centro|ep|ees|ji|eee|cea|cens|tec)$/i
  const levelMatch = trimmed.match(schoolLevelPattern)

  if (levelMatch) {
    const schoolType = normalizeText(levelMatch[1])
    return { type: "school_level", schoolType }
  }

  // Búsqueda por texto general
  return { type: "text", value: trimmed }
}

/**
 * Mapea sinónimos de tipos de escuela
 */
export function getSchoolTypeSynonyms(type: string): string[] {
  const normalized = normalizeText(type)

  const synonymMap: Record<string, string[]> = {
    // Técnica
    tecnica: ["tecnica", "técnica", "tec", "escuela tecnica", "escuela técnica", "et"],
    técnica: ["tecnica", "técnica", "tec", "escuela tecnica", "escuela técnica", "et"],
    tec: ["tecnica", "técnica", "tec", "escuela tecnica", "escuela técnica", "et"],

    // Jardín
    jardin: ["jardin", "jardín", "ji", "j.i.", "infantes", "jardin de infantes", "jardín de infantes"],
    jardín: ["jardin", "jardín", "ji", "j.i.", "infantes", "jardin de infantes", "jardín de infantes"],
    infantes: ["jardin", "jardín", "ji", "j.i.", "infantes", "jardin de infantes", "jardín de infantes"],
    ji: ["jardin", "jardín", "ji", "j.i.", "infantes", "jardin de infantes", "jardín de infantes"],

    // Secundaria
    secundaria: ["secundaria", "ees", "media", "escuela secundaria"],
    ees: ["secundaria", "ees", "media", "escuela secundaria"],
    media: ["secundaria", "ees", "media", "escuela secundaria"],

    // Primaria
    primaria: ["primaria", "ep", "escuela primaria"],
    ep: ["primaria", "ep", "escuela primaria"],

    // CFP
    cfp: ["cfp", "centro de formacion profesional", "centro de formación profesional", "formacion profesional"],
    centro: ["cfp", "centro de formacion profesional", "centro de formación profesional", "formacion profesional"],

    // Especial
    especial: ["especial", "eee", "escuela especial"],
    eee: ["especial", "eee", "escuela especial"],

    // Adultos
    adultos: ["adultos", "cea", "cens", "centro de adultos"],
    cea: ["adultos", "cea", "cens", "centro de adultos"],
    cens: ["adultos", "cea", "cens", "centro de adultos"],
  }

  return synonymMap[normalized] || []
}

/**
 * Construye una expresión regex para PostgreSQL que busca un número como token exacto
 * Ejemplo: para número "8" genera: (^|[^0-9])8([^0-9]|$)
 */
export function buildNumberTokenRegex(number: string): string {
  // Word boundary para números: debe estar al inicio, fin, o rodeado de no-dígitos
  return `(^|[^0-9])${number}([^0-9]|$)`
}

/**
 * Mapea el nivel detectado en la búsqueda a los valores usados en la base de datos
 */
export function mapNivelToDB(nivelInput: string): string[] {
  const normalized = normalizeText(nivelInput)

  const nivelMap: Record<string, string[]> = {
    // Nivel Primario
    primaria: ["Nivel Primario", "Primaria"],
    primario: ["Nivel Primario", "Primaria"],

    // Nivel Secundario
    secundaria: ["Nivel Secundario", "Secundaria"],
    secundario: ["Nivel Secundario", "Secundaria"],

    // Nivel Inicial
    inicial: ["Nivel Inicial", "Inicial"],
    jardin: ["Nivel Inicial", "Inicial", "Jardín"],

    // Técnica
    tecnica: ["Nivel Secundario", "Secundaria", "Técnica"],

    // Especial
    especial: ["Nivel Especial", "Especial"],

    // Adultos
    adultos: ["Adultos", "Nivel Adultos"],
    adulto: ["Adultos", "Nivel Adultos"],

    // Superior
    superior: ["Nivel Superior", "Superior"],

    // Formación Profesional
    "formacion profesional": ["Formación Profesional", "CFP"],
    formacion: ["Formación Profesional", "CFP"],
  }

  return nivelMap[normalized] || [nivelInput]
}
