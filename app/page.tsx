import { createClient } from "@/lib/supabase/server"
import { DashboardHome } from "@/components/dashboard-home"

async function getMetrics() {
  const supabase = await createClient()

  const [
    { count: totalEstablecimientos },
    { data: distritosData },
    { data: matriculaData },
    { count: totalOrganismos },
    { data: fedData },
  ] = await Promise.all([
    supabase
      .from("establecimientos")
      .select("*", { count: "exact", head: true })
      .eq("es_establecimiento_educativo", true),
    supabase.from("establecimientos").select("distrito").eq("es_establecimiento_educativo", true),
    supabase.from("establecimientos").select("varones, mujeres").eq("es_establecimiento_educativo", true),
    supabase.from("organismos_descentralizados").select("*", { count: "exact", head: true }),
    supabase.from("establecimientos").select("fed_a_cargo").eq("es_establecimiento_educativo", true),
  ])

  const uniqueDistritos = new Set(distritosData?.map((d) => d.distrito).filter(Boolean)).size
  const matriculaTotal =
    matriculaData?.reduce((sum, row) => sum + (Number(row.varones) || 0) + (Number(row.mujeres) || 0), 0) || 0

  const varonesTotal = matriculaData?.reduce((sum, row) => sum + (Number(row.varones) || 0), 0) || 0
  const mujeresTotal = matriculaData?.reduce((sum, row) => sum + (Number(row.mujeres) || 0), 0) || 0

  const distritoCounts = new Map<string, number>()
  for (const row of distritosData || []) {
    const distrito = row.distrito?.trim()
    if (!distrito) continue
    distritoCounts.set(distrito, (distritoCounts.get(distrito) || 0) + 1)
  }
  const distritoBreakdown = Array.from(distritoCounts.entries())
    .map(([distrito, count]) => ({ distrito, count }))
    .sort((a, b) => b.count - a.count)

  const fedCounts = new Map<string, number>()
  for (const row of fedData || []) {
    const fed = row.fed_a_cargo?.trim() || "Sin FED asignado"
    fedCounts.set(fed, (fedCounts.get(fed) || 0) + 1)
  }
  const fedBreakdown = Array.from(fedCounts.entries())
    .map(([fed, count]) => ({ fed, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalEstablecimientos: totalEstablecimientos || 0,
    uniqueDistritos,
    matriculaTotal,
    totalOrganismos: totalOrganismos || 0,
    fedBreakdown,
    distritoBreakdown,
    matriculaByGender: { varones: varonesTotal, mujeres: mujeresTotal },
  }
}

export default async function Home() {
  const metrics = await getMetrics()

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(0,174,195,0.08),transparent_55%),radial-gradient(900px_circle_at_80%_10%,rgba(65,112,153,0.08),transparent_50%),linear-gradient(to_bottom,white,#f5f8fb)]">
      <DashboardHome metrics={metrics} />
    </main>
  )
}
