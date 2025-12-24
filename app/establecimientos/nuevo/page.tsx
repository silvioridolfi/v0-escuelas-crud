import { CreateEstablishmentForm } from "@/components/create-establishment-form"

export default function NuevoEstablecimientoPage() {
  console.log("[v0] NuevoEstablecimientoPage component rendering")

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
