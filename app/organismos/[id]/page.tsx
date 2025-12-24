import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { OrganismoEditor } from "@/components/organismo-editor"

export const dynamic = "force-dynamic"

export default async function OrganismoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: organismo, error } = await supabase
    .from("organismos_descentralizados")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !organismo) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/20 via-transparent to-transparent" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />
      <div className="relative">
        <OrganismoEditor organismo={organismo} />
      </div>
    </div>
  )
}
