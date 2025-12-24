import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EstablishmentEditor } from "@/components/establishment-editor"
import { CreateEstablishmentForm } from "@/components/create-establishment-form"

export const dynamic = "force-dynamic"

export default async function EstablishmentPage({ params }: { params: { id: string } }) {
  const { id } = params

  if (id === "nuevo") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-slate-50">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/20 via-transparent to-transparent" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />
        <div className="relative">
          <CreateEstablishmentForm />
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: establecimiento, error } = await supabase.from("establecimientos").select("*").eq("id", id).single()

  if (error || !establecimiento) {
    notFound()
  }

  const { data: contactos } = await supabase
    .from("contactos")
    .select("*")
    .eq("cue", establecimiento.cue)
    .order("apellido", { ascending: true })

  return <EstablishmentEditor establecimiento={establecimiento} contactos={contactos || []} />
}
