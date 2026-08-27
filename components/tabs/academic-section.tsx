"use client"

import { useState } from "react"
import { Users, GraduationCap, Calendar } from "lucide-react"
import { StatTile } from "@/components/tabs/hero-widgets"
import { EditSectionToggle } from "@/components/tabs/edit-section-toggle"
import { AcademicTab } from "@/components/tabs/academic-tab"
import { formatTurno } from "@/lib/badge-colors"
import type { Establecimiento as EstablecimientoFull } from "@/lib/establecimiento"

type Establecimiento = Pick<
  EstablecimientoFull,
  "id" | "nivel" | "modalidad" | "matricula" | "varones" | "mujeres" | "secciones" | "turnos"
>

export function AcademicSection({ establecimiento }: { establecimiento: Establecimiento }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <EditSectionToggle isEditing={isEditing} onToggle={() => setIsEditing((v) => !v)} />
      </div>

      {isEditing ? (
        <AcademicTab establecimiento={establecimiento} isEditing={isEditing} onSaved={() => setIsEditing(false)} />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatTile icon={Users} label="Nivel" value={establecimiento.nivel} iconColor="text-teal-600" iconBg="bg-teal-50" />
          <StatTile
            icon={GraduationCap}
            label="Modalidad"
            value={establecimiento.modalidad}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatTile icon={Calendar} label="Turno" value={formatTurno(establecimiento.turnos)} iconColor="text-[#417099]" iconBg="bg-[#417099]/10" />
          <StatTile
            icon={Users}
            label="Matrícula"
            value={establecimiento.matricula ? `${establecimiento.matricula.toLocaleString("es-AR")} estudiantes` : null}
            iconColor="text-[#e81f76]"
            iconBg="bg-[#e81f76]/10"
          />
        </div>
      )}
    </div>
  )
}
