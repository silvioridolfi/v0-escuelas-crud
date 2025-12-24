/**
 * Returns a consistent color class for each FED
 * "Sin FED asignado" gets a warning color (yellow/amber)
 */
export function getFedBadgeColor(fedName: string | null | undefined): string {
  if (!fedName || fedName === "Sin FED asignado") {
    return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
  }

  // Assign unique colors to each FED
  const fedColors: Record<string, string> = {
    "Silvio Ridolfi": "bg-orange-500/10 text-orange-700 border-orange-500/20",
    "Jorge Pérez": "bg-red-500/10 text-red-700 border-red-500/20",
    "Andrés Guzmán": "bg-blue-500/10 text-blue-700 border-blue-500/20",
    "Carlos Franco": "bg-green-500/10 text-green-700 border-green-500/20",
    "Daniela Cortes": "bg-pink-500/10 text-pink-700 border-pink-500/20",
    "Macarena Duarte Buschiazzo": "bg-violet-500/10 text-violet-700 border-violet-500/20",
    "Marcos Pettiná": "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  }

  return fedColors[fedName] || "bg-gray-500/10 text-gray-700 border-gray-500/20"
}

/**
 * Returns a consistent color class for each educational level
 * Uses the primary level from combined levels (e.g., "Nivel Primario / Nivel Secundario" → Primario color)
 */
export function getNivelBadgeColor(nivel: string | null | undefined): string {
  if (!nivel) {
    return "bg-gray-500/10 text-gray-700 border-gray-500/20"
  }

  // Check for primary level keywords (order matters - check more specific first)
  if (nivel.includes("Nivel Inicial")) {
    return "bg-sky-500/10 text-sky-700 border-sky-500/20"
  }
  if (nivel.includes("Nivel Primario")) {
    return "bg-teal-500/10 text-teal-700 border-teal-500/20"
  }
  if (nivel.includes("Nivel Secundario")) {
    return "bg-indigo-500/10 text-indigo-700 border-indigo-500/20"
  }
  if (nivel.includes("Nivel Superior")) {
    return "bg-purple-500/10 text-purple-700 border-purple-500/20"
  }
  if (nivel.includes("Formación Profesional")) {
    return "bg-amber-500/10 text-amber-700 border-amber-500/20"
  }
  if (nivel.includes("Formación Integral")) {
    return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
  }
  if (nivel.includes("Educación Física")) {
    return "bg-lime-500/10 text-lime-700 border-lime-500/20"
  }
  if (nivel.includes("Psicología") || nivel.includes("C.E.C")) {
    return "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20"
  }
  if (nivel.includes("NIVEL CENTRAL")) {
    return "bg-slate-500/10 text-slate-700 border-slate-500/20"
  }

  return "bg-gray-500/10 text-gray-700 border-gray-500/20"
}

/**
 * Formats FED name with prefix for display
 */
export function formatFedDisplay(fedName: string | null | undefined): string {
  if (!fedName) {
    return "FED Asignado: Sin FED asignado"
  }
  return `FED Asignado: ${fedName}`
}
