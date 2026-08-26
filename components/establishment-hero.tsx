import type React from "react"
import { Building2, MapPin, Users, GraduationCap, Calendar, Wifi, Link2, Mail, Phone, CircleAlert } from "lucide-react"
import type { Establecimiento } from "@/lib/establecimiento"

type ContactoPrimario = {
  nombre: string | null
  apellido: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
} | null

function initials(nombre: string | null, apellido: string | null) {
  const a = nombre?.[0] || ""
  const b = apellido?.[0] || ""
  return (a + b).toUpperCase() || "?"
}

function StatTile({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-800 break-words">{value || "—"}</p>
    </div>
  )
}

function PlanRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  value: string | null | undefined
  color: string
}) {
  if (!value) return null
  return (
    <div className={`flex items-center gap-3 border-l-2 py-2 pl-3`} style={{ borderColor: color }}>
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}

export function EstablishmentHero({
  establecimiento,
  isGovernmentBuilding,
  contactoPrimario,
}: {
  establecimiento: Establecimiento
  isGovernmentBuilding: boolean
  contactoPrimario?: ContactoPrimario
}) {
  const isClosedOrContext =
    establecimiento.tipo_establecimiento === "Escuela cerrada" || establecimiento.tipo_establecimiento === "Contexto de encierro"

  const nombreContacto = contactoPrimario
    ? [contactoPrimario.nombre, contactoPrimario.apellido].filter(Boolean).join(" ")
    : null

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${isClosedOrContext ? "border-red-200" : "border-slate-200/60"}`}
    >
      <div
        className={`h-1 ${isClosedOrContext ? "bg-red-500" : "bg-gradient-to-r from-[#e81f76] via-[#00AEC3] to-[#417099]"}`}
      />

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#417099]/10">
              <Building2 className="h-6 w-6 text-[#417099]" />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">CUE</p>
                <p className="text-sm font-semibold text-slate-800">{establecimiento.cue}</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Distrito</p>
                <p className="text-sm font-semibold text-slate-800">{establecimiento.distrito}</p>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isClosedOrContext ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isClosedOrContext ? "bg-red-500" : "bg-emerald-500"}`} />
            {isClosedOrContext ? establecimiento.tipo_establecimiento?.toUpperCase() : "ACTIVA"}
          </span>
        </div>

        <h2 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{establecimiento.nombre}</h2>
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00AEC3]" />
          {[establecimiento.direccion, establecimiento.ciudad, establecimiento.distrito].filter(Boolean).join(", ")}
        </p>

        {!isGovernmentBuilding && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <StatTile
                icon={Users}
                label="Nivel"
                value={establecimiento.nivel}
                iconColor="text-teal-600"
                iconBg="bg-teal-50"
              />
              <StatTile
                icon={GraduationCap}
                label="Modalidad"
                value={establecimiento.modalidad}
                iconColor="text-indigo-600"
                iconBg="bg-indigo-50"
              />
              <StatTile
                icon={Calendar}
                label="Turno"
                value={establecimiento.turnos}
                iconColor="text-[#417099]"
                iconBg="bg-[#417099]/10"
              />
              <StatTile
                icon={Users}
                label="Matrícula"
                value={establecimiento.matricula ? `${establecimiento.matricula.toLocaleString("es-AR")} estudiantes` : null}
                iconColor="text-[#e81f76]"
                iconBg="bg-[#e81f76]/10"
              />
            </div>

            {(establecimiento.plan_enlace || establecimiento.plan_piso_tecnologico) && (
              <div className="mt-5 space-y-1 border-t border-slate-100 pt-4">
                <PlanRow icon={Link2} label="Plan de enlace" value={establecimiento.plan_enlace} color="#7c3aed" />
                <PlanRow
                  icon={Wifi}
                  label="Piso tecnológico"
                  value={establecimiento.plan_piso_tecnologico}
                  color="#00AEC3"
                />
              </div>
            )}
          </>
        )}

        {(contactoPrimario || establecimiento.fed_a_cargo) && (
          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            {contactoPrimario && (
              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Contacto institucional
                </p>
                <div className="flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#00AEC3]/40 bg-[#00AEC3]/10 text-xs font-semibold text-[#00AEC3]">
                    {initials(contactoPrimario.nombre, contactoPrimario.apellido)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{nombreContacto}</p>
                    {contactoPrimario.cargo && <p className="text-xs text-slate-500">{contactoPrimario.cargo}</p>}
                    {contactoPrimario.correo && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{contactoPrimario.correo}</span>
                      </p>
                    )}
                    {contactoPrimario.telefono && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
                        <Phone className="h-3 w-3 shrink-0" />
                        {contactoPrimario.telefono}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isGovernmentBuilding && establecimiento.fed_a_cargo && (
              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">FED a cargo</p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#417099]/40 bg-[#417099]/10 text-xs font-semibold text-[#417099]">
                    {initials(establecimiento.fed_a_cargo.split(" ")[0], establecimiento.fed_a_cargo.split(" ")[1])}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{establecimiento.fed_a_cargo}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {isGovernmentBuilding && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <CircleAlert className="h-3.5 w-3.5" />
            Sede central de la DTE — no aplican datos académicos ni de conectividad
          </p>
        )}
      </div>
    </div>
  )
}
