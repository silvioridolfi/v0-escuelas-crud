import { UserRound } from "lucide-react"
import { initials } from "@/components/tabs/hero-widgets"
import { ContactTab } from "@/components/tabs/contact-tab"

type Contacto = {
  id: string
  cue: number
  nombre: string | null
  apellido: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
  correo_laboral: string | null
  distrito: string | null
  fed_a_cargo: string | null
  es_principal?: boolean
}

export function ContactSection({
  cue,
  contactos,
  distrito,
  fedACargo,
}: {
  cue: number
  contactos: Contacto[]
  distrito: string
  fedACargo: string | null
}) {
  return (
    <div className="space-y-6">
      {fedACargo && (
        <div className="rounded-lg border border-slate-100 bg-slate-50/60 dark:border-white/10 dark:bg-white/5 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">FED a cargo</p>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#417099]/40 bg-[#417099]/10 text-xs font-semibold text-[#417099]">
              {initials(fedACargo.split(" ")[0], fedACargo.split(" ")[1])}
            </div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-white">
              <UserRound className="h-3.5 w-3.5 text-slate-400 dark:text-gray-400" />
              {fedACargo}
            </p>
          </div>
        </div>
      )}

      <ContactTab cue={cue} contactos={contactos} distrito={distrito} fedACargo={fedACargo || ""} />
    </div>
  )
}
