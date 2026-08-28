export type QuickFilterKey = "cerradas" | "contexto" | "sin_fed" | "sin_contacto" | "nuevos"

export const QUICK_FILTERS: { key: QuickFilterKey; label: string }[] = [
  { key: "cerradas", label: "Escuelas cerradas" },
  { key: "contexto", label: "Contexto de encierro" },
  { key: "sin_fed", label: "Sin FED asignado" },
  { key: "sin_contacto", label: "Sin contacto" },
  { key: "nuevos", label: "Nuevos establecimientos" },
]
