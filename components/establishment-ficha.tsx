import type React from "react"
import { Building2, MapPin, Users, GraduationCap, UserRound, Landmark, Wifi, Phone, Mail, FileWarning, Layers, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Establecimiento } from "@/lib/establecimiento"

type ContactoPrimario = {
  nombre: string | null
  apellido: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
} | null

function FichaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="break-words text-sm text-slate-700">{value}</p>
      </div>
    </div>
  )
}

function FichaSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-slate-100 pt-3 mt-3 first:mt-0 first:border-t-0 first:pt-0">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-[#00AEC3]" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  )
}

// Resume el estado de conectividad priorizando el primer programa que tenga
// un estado cargado (PNCE, PBA Grupo 1, PBA 2019, PBA Grupo 2-A, o el
// genérico estado_instalacion_pba), junto con su proveedor si lo hay.
function getConectividadResumen(e: Establecimiento): { estado: string; proveedor: string | null } | null {
  const programas: [string | null, string | null][] = [
    [e.pnce_estado, e.proveedor_internet_pnce],
    [e.pba_grupo_1_estado, e.pba_grupo_1_proveedor_internet],
    [e.pba_2019_estado, e.pba_2019_proveedor_internet],
    [e.pba_grupo_2_a_estado, e.pba_grupo_2_a_proveedor_internet],
    [e.estado_instalacion_pba, e.proveedor_asignado_pba],
  ]
  const encontrado = programas.find(([estado]) => estado && estado.trim())
  if (!encontrado) return null
  return { estado: encontrado[0] as string, proveedor: encontrado[1] }
}

export function EstablishmentFicha({
  establecimiento,
  isGovernmentBuilding,
  contactoPrimario,
}: {
  establecimiento: Establecimiento
  isGovernmentBuilding: boolean
  contactoPrimario?: ContactoPrimario
}) {
  const conectividad = getConectividadResumen(establecimiento)
  const nombreContacto = contactoPrimario
    ? [contactoPrimario.nombre, contactoPrimario.apellido].filter(Boolean).join(" ")
    : null

  return (
    <aside className="lg:w-96 lg:shrink-0">
      <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md lg:sticky lg:top-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#417099]/10">
            <Building2 className="h-5 w-5 text-[#417099]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">CUE</p>
            <p className="text-sm font-semibold text-slate-800">{establecimiento.cue}</p>
          </div>
        </div>

        {isGovernmentBuilding && (
          <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            {establecimiento.tipo_establecimiento || "Edificio Gubernamental"}
          </Badge>
        )}

        {/* Datos generales, siempre visibles */}
        <div className="divide-y divide-slate-50">
          <FichaRow icon={MapPin} label="Distrito / Ciudad" value={`${establecimiento.distrito} · ${establecimiento.ciudad}`} />
          <FichaRow icon={MapPin} label="Dirección" value={establecimiento.direccion} />
          <FichaRow icon={Landmark} label="Dependencia" value={establecimiento.dependencia_completa} />
          {!isGovernmentBuilding && <FichaRow icon={UserRound} label="FED a cargo" value={establecimiento.fed_a_cargo || "Sin asignar"} />}
          {!isGovernmentBuilding && <FichaRow icon={Layers} label="Ámbito" value={establecimiento.ambito} />}
        </div>

        {!isGovernmentBuilding && (
          <>
            {/* 1. Conectividad */}
            {conectividad && (
              <FichaSection icon={Wifi} title="Conectividad">
                <FichaRow icon={Wifi} label="Estado" value={conectividad.estado} />
                <FichaRow icon={Wifi} label="Proveedor" value={conectividad.proveedor} />
                <FichaRow icon={Wifi} label="Ancho de banda" value={establecimiento.mb} />
              </FichaSection>
            )}

            {/* 2. Contacto */}
            {contactoPrimario && (contactoPrimario.telefono || contactoPrimario.correo) && (
              <FichaSection icon={Phone} title="Contacto">
                <FichaRow icon={UserRound} label={contactoPrimario.cargo || "Referente"} value={nombreContacto} />
                <FichaRow icon={Phone} label="Teléfono" value={contactoPrimario.telefono} />
                <FichaRow icon={Mail} label="Email" value={contactoPrimario.correo} />
              </FichaSection>
            )}

            {/* 3. Académico */}
            <FichaSection icon={GraduationCap} title="Académico">
              <FichaRow
                icon={GraduationCap}
                label="Nivel / Modalidad"
                value={
                  establecimiento.nivel || establecimiento.modalidad
                    ? `${establecimiento.nivel || ""}${establecimiento.nivel && establecimiento.modalidad ? " · " : ""}${establecimiento.modalidad || ""}`
                    : null
                }
              />
              <FichaRow icon={Users} label="Matrícula" value={establecimiento.matricula ? establecimiento.matricula.toLocaleString("es-AR") : null} />
              <FichaRow
                icon={Users}
                label="Varones / Mujeres"
                value={
                  establecimiento.varones || establecimiento.mujeres
                    ? `${establecimiento.varones ?? 0} · ${establecimiento.mujeres ?? 0}`
                    : null
                }
              />
              <FichaRow icon={Layers} label="Secciones" value={establecimiento.secciones || null} />
              <FichaRow icon={Clock} label="Turnos" value={establecimiento.turnos} />
            </FichaSection>

            {/* 4. Observaciones */}
            {establecimiento.observaciones && (
              <FichaSection icon={FileWarning} title="Observaciones">
                <p className="py-1 text-sm text-slate-600">{establecimiento.observaciones}</p>
              </FichaSection>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
