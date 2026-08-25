import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Compara los valores "antes" y "después" de un guardado y registra una fila
 * en historial_cambios por cada campo que efectivamente cambió. No lanza si
 * falla el insert (el historial es un nice-to-have, nunca debe bloquear el
 * guardado real de datos).
 */
export async function logFieldChanges(
  supabase: SupabaseClient,
  params: {
    establecimientoId: string
    seccion: string
    before: Record<string, unknown>
    after: Record<string, unknown>
    labels: Record<string, string>
  },
) {
  const { establecimientoId, seccion, before, after, labels } = params

  const rows: {
    establecimiento_id: string
    seccion: string
    campo: string
    valor_anterior: string | null
    valor_nuevo: string | null
  }[] = []

  for (const key of Object.keys(labels)) {
    const prev = before[key] ?? null
    const next = after[key] ?? null
    const prevStr = prev === null || prev === undefined ? null : String(prev)
    const nextStr = next === null || next === undefined ? null : String(next)
    if (prevStr === nextStr) continue

    rows.push({
      establecimiento_id: establecimientoId,
      seccion,
      campo: labels[key],
      valor_anterior: prevStr,
      valor_nuevo: nextStr,
    })
  }

  if (rows.length === 0) return

  try {
    await supabase.from("historial_cambios").insert(rows)
  } catch (error) {
    console.error("[v0] Error registrando historial de cambios:", error)
  }
}
