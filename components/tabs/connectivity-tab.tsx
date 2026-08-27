"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateConnectivity } from "@/app/actions/update-connectivity"
import { useRouter } from "next/navigation"
import type { Establecimiento as EstablecimientoFull } from "@/lib/establecimiento"
import { SectionHeader } from "@/components/tabs/section-header"

type Establecimiento = Pick<
  EstablecimientoFull,
  | "id"
  | "plan_enlace"
  | "subplan_enlace"
  | "fecha_inicio_conectividad"
  | "mb"
  | "listado_conexion_internet"
  | "pnce_estado"
  | "proveedor_internet_pnce"
  | "fecha_instalacion_pnce"
  | "pnce_fecha_mejora"
  | "pnce_tipo_mejora"
  | "pba_grupo_1_estado"
  | "pba_grupo_1_proveedor_internet"
  | "pba_grupo_1_fecha_instalacion"
  | "reclamos_grupo_1_ani"
  | "pba_2019_estado"
  | "pba_2019_proveedor_internet"
  | "pba_2019_fecha_instalacion"
  | "pba_grupo_2_a_estado"
  | "pba_grupo_2_a_proveedor_internet"
  | "pba_grupo_2_a_fecha_instalacion"
  | "pba_grupo_2_a_fecha_mejora"
  | "pba_grupo_2_a_tipo_mejora"
  | "estado_instalacion_pba"
  | "proveedor_asignado_pba"
  | "plan_piso_tecnologico"
  | "tipo_piso_instalado"
  | "fecha_terminado_piso_tecnologico_cue"
  | "proveedor_piso_tecnologico_cue"
  | "fecha_mejora"
  | "tipo_mejora"
>

export function ConnectivityTab({
  establecimiento,
  isEditing,
  onSaved,
}: {
  establecimiento: Establecimiento
  isEditing: boolean
  onSaved?: () => void
}) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    plan_enlace: establecimiento.plan_enlace || "",
    subplan_enlace: establecimiento.subplan_enlace || "",
    fecha_inicio_conectividad: establecimiento.fecha_inicio_conectividad || "",
    mb: establecimiento.mb || "",
    listado_conexion_internet: establecimiento.listado_conexion_internet || "",
    pnce_estado: establecimiento.pnce_estado || "",
    proveedor_internet_pnce: establecimiento.proveedor_internet_pnce || "",
    fecha_instalacion_pnce: establecimiento.fecha_instalacion_pnce || "",
    pnce_fecha_mejora: establecimiento.pnce_fecha_mejora || "",
    pnce_tipo_mejora: establecimiento.pnce_tipo_mejora || "",
    pba_grupo_1_estado: establecimiento.pba_grupo_1_estado || "",
    pba_grupo_1_proveedor_internet: establecimiento.pba_grupo_1_proveedor_internet || "",
    pba_grupo_1_fecha_instalacion: establecimiento.pba_grupo_1_fecha_instalacion || "",
    reclamos_grupo_1_ani: establecimiento.reclamos_grupo_1_ani || "",
    pba_2019_estado: establecimiento.pba_2019_estado || "",
    pba_2019_proveedor_internet: establecimiento.pba_2019_proveedor_internet || "",
    pba_2019_fecha_instalacion: establecimiento.pba_2019_fecha_instalacion || "",
    pba_grupo_2_a_estado: establecimiento.pba_grupo_2_a_estado || "",
    pba_grupo_2_a_proveedor_internet: establecimiento.pba_grupo_2_a_proveedor_internet || "",
    pba_grupo_2_a_fecha_instalacion: establecimiento.pba_grupo_2_a_fecha_instalacion || "",
    pba_grupo_2_a_fecha_mejora: establecimiento.pba_grupo_2_a_fecha_mejora || "",
    pba_grupo_2_a_tipo_mejora: establecimiento.pba_grupo_2_a_tipo_mejora || "",
    estado_instalacion_pba: establecimiento.estado_instalacion_pba || "",
    proveedor_asignado_pba: establecimiento.proveedor_asignado_pba || "",
    plan_piso_tecnologico: establecimiento.plan_piso_tecnologico || "",
    tipo_piso_instalado: establecimiento.tipo_piso_instalado || "",
    fecha_terminado_piso_tecnologico_cue: establecimiento.fecha_terminado_piso_tecnologico_cue || "",
    proveedor_piso_tecnologico_cue: establecimiento.proveedor_piso_tecnologico_cue || "",
    fecha_mejora: establecimiento.fecha_mejora || "",
    tipo_mejora: establecimiento.tipo_mejora || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const result = await updateConnectivity(establecimiento.id, formData)
      if (result.success) {
        setMessage("Guardado exitosamente")
        router.refresh()
        onSaved?.()
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      setMessage("Error al guardar")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">

      <SectionHeader title="Plan de Enlace" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plan_enlace">Plan de Enlace</Label>
          <Input
            id="plan_enlace"
            value={formData.plan_enlace}
            onChange={(e) => updateField("plan_enlace", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subplan_enlace">Subplan de Enlace</Label>
          <Input
            id="subplan_enlace"
            value={formData.subplan_enlace}
            onChange={(e) => updateField("subplan_enlace", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio_conectividad">Fecha de Inicio de Conectividad</Label>
          <Input
            id="fecha_inicio_conectividad"
            value={formData.fecha_inicio_conectividad}
            onChange={(e) => updateField("fecha_inicio_conectividad", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mb">Ancho de Banda (Mb)</Label>
          <Input
            id="mb"
            value={formData.mb}
            onChange={(e) => updateField("mb", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="listado_conexion_internet">Listado de Conexión a Internet</Label>
          <Input
            id="listado_conexion_internet"
            value={formData.listado_conexion_internet}
            onChange={(e) => updateField("listado_conexion_internet", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <SectionHeader title="PNCE - Plan Nacional de Conectividad Escolar" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pnce_estado">PNCE (Estado)</Label>
          <Input
            id="pnce_estado"
            value={formData.pnce_estado}
            onChange={(e) => updateField("pnce_estado", e.target.value)}
            placeholder="Estado del Plan Nacional de Conectividad Escolar"
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proveedor_internet_pnce">Proveedor de Internet (PNCE)</Label>
          <Input
            id="proveedor_internet_pnce"
            value={formData.proveedor_internet_pnce}
            onChange={(e) => updateField("proveedor_internet_pnce", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_instalacion_pnce">Fecha de Instalación (PNCE)</Label>
          <Input
            id="fecha_instalacion_pnce"
            value={formData.fecha_instalacion_pnce}
            onChange={(e) => updateField("fecha_instalacion_pnce", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pnce_fecha_mejora">Fecha de Mejora (PNCE)</Label>
          <Input
            id="pnce_fecha_mejora"
            value={formData.pnce_fecha_mejora}
            onChange={(e) => updateField("pnce_fecha_mejora", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pnce_tipo_mejora">Tipo de Mejora (PNCE)</Label>
          <Input
            id="pnce_tipo_mejora"
            value={formData.pnce_tipo_mejora}
            onChange={(e) => updateField("pnce_tipo_mejora", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <SectionHeader title="PBA - Grupo 1" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_1_estado">PBA - Grupo 1 (Estado)</Label>
          <Input
            id="pba_grupo_1_estado"
            value={formData.pba_grupo_1_estado}
            onChange={(e) => updateField("pba_grupo_1_estado", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_1_proveedor_internet">Proveedor de Internet (Grupo 1)</Label>
          <Input
            id="pba_grupo_1_proveedor_internet"
            value={formData.pba_grupo_1_proveedor_internet}
            onChange={(e) => updateField("pba_grupo_1_proveedor_internet", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_1_fecha_instalacion">Fecha de Instalación (Grupo 1)</Label>
          <Input
            id="pba_grupo_1_fecha_instalacion"
            value={formData.pba_grupo_1_fecha_instalacion}
            onChange={(e) => updateField("pba_grupo_1_fecha_instalacion", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reclamos_grupo_1_ani">Reclamos Grupo 1 (ANI)</Label>
          <Input
            id="reclamos_grupo_1_ani"
            value={formData.reclamos_grupo_1_ani}
            onChange={(e) => updateField("reclamos_grupo_1_ani", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <SectionHeader title="PBA 2019" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pba_2019_estado">PBA 2019 (Estado)</Label>
          <Input
            id="pba_2019_estado"
            value={formData.pba_2019_estado}
            onChange={(e) => updateField("pba_2019_estado", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pba_2019_proveedor_internet">Proveedor de Internet (PBA 2019)</Label>
          <Input
            id="pba_2019_proveedor_internet"
            value={formData.pba_2019_proveedor_internet}
            onChange={(e) => updateField("pba_2019_proveedor_internet", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pba_2019_fecha_instalacion">Fecha de Instalación (PBA 2019)</Label>
          <Input
            id="pba_2019_fecha_instalacion"
            value={formData.pba_2019_fecha_instalacion}
            onChange={(e) => updateField("pba_2019_fecha_instalacion", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <SectionHeader title="PBA - Grupo 2-A" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_2_a_estado">PBA - Grupo 2-A (Estado)</Label>
          <Input
            id="pba_grupo_2_a_estado"
            value={formData.pba_grupo_2_a_estado}
            onChange={(e) => updateField("pba_grupo_2_a_estado", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_2_a_proveedor_internet">Proveedor de Internet (Grupo 2-A)</Label>
          <Input
            id="pba_grupo_2_a_proveedor_internet"
            value={formData.pba_grupo_2_a_proveedor_internet}
            onChange={(e) => updateField("pba_grupo_2_a_proveedor_internet", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_2_a_fecha_instalacion">Fecha de Instalación (Grupo 2-A)</Label>
          <Input
            id="pba_grupo_2_a_fecha_instalacion"
            value={formData.pba_grupo_2_a_fecha_instalacion}
            onChange={(e) => updateField("pba_grupo_2_a_fecha_instalacion", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_2_a_fecha_mejora">Fecha de Mejora (Grupo 2-A)</Label>
          <Input
            id="pba_grupo_2_a_fecha_mejora"
            value={formData.pba_grupo_2_a_fecha_mejora}
            onChange={(e) => updateField("pba_grupo_2_a_fecha_mejora", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pba_grupo_2_a_tipo_mejora">Tipo de Mejora (Grupo 2-A)</Label>
          <Input
            id="pba_grupo_2_a_tipo_mejora"
            value={formData.pba_grupo_2_a_tipo_mejora}
            onChange={(e) => updateField("pba_grupo_2_a_tipo_mejora", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <SectionHeader title="Estado General PBA" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="estado_instalacion_pba">Estado General de Instalación (PBA)</Label>
          <Input
            id="estado_instalacion_pba"
            value={formData.estado_instalacion_pba}
            onChange={(e) => updateField("estado_instalacion_pba", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proveedor_asignado_pba">Proveedor Asignado (PBA)</Label>
          <Input
            id="proveedor_asignado_pba"
            value={formData.proveedor_asignado_pba}
            onChange={(e) => updateField("proveedor_asignado_pba", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <SectionHeader title="Infraestructura Tecnológica" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plan_piso_tecnologico">Plan Piso Tecnológico</Label>
          <Input
            id="plan_piso_tecnologico"
            value={formData.plan_piso_tecnologico}
            onChange={(e) => updateField("plan_piso_tecnologico", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_piso_instalado">Tipo de Piso Instalado</Label>
          <Input
            id="tipo_piso_instalado"
            value={formData.tipo_piso_instalado}
            onChange={(e) => updateField("tipo_piso_instalado", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_terminado_piso_tecnologico_cue">Fecha de Finalización del Piso Tecnológico</Label>
          <Input
            id="fecha_terminado_piso_tecnologico_cue"
            value={formData.fecha_terminado_piso_tecnologico_cue}
            onChange={(e) => updateField("fecha_terminado_piso_tecnologico_cue", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proveedor_piso_tecnologico_cue">Proveedor del Piso Tecnológico</Label>
          <Input
            id="proveedor_piso_tecnologico_cue"
            value={formData.proveedor_piso_tecnologico_cue}
            onChange={(e) => updateField("proveedor_piso_tecnologico_cue", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_mejora">Fecha de Mejora</Label>
          <Input
            id="fecha_mejora"
            value={formData.fecha_mejora}
            onChange={(e) => updateField("fecha_mejora", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_mejora">Tipo de Mejora Realizada</Label>
          <Input
            id="tipo_mejora"
            value={formData.tipo_mejora}
            onChange={(e) => updateField("tipo_mejora", e.target.value)}
            placeholder="Tipo de mejora realizada"
            disabled={!isEditing}
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}

      {isEditing && (
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      )}
    </div>
  )
}
