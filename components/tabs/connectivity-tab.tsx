"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateConnectivity } from "@/app/actions/update-connectivity"
import { useRouter } from "next/navigation"

type Establecimiento = {
  id: string
  plan_enlace: string | null
  plan_piso_tecnologico: string | null
  pnce_estado: string | null
  pba_grupo_1_estado: string | null
  pba_2019_estado: string | null
  pba_grupo_2_a_estado: string | null
  estado_instalacion_pba: string | null
  tipo_mejora: string | null
  [key: string]: unknown
}

export function ConnectivityTab({ establecimiento }: { establecimiento: Establecimiento }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    plan_enlace: establecimiento.plan_enlace || "",
    pnce_estado: establecimiento.pnce_estado || "",
    pba_grupo_1_estado: establecimiento.pba_grupo_1_estado || "",
    pba_2019_estado: establecimiento.pba_2019_estado || "",
    pba_grupo_2_a_estado: establecimiento.pba_grupo_2_a_estado || "",
    estado_instalacion_pba: establecimiento.estado_instalacion_pba || "",
    plan_piso_tecnologico: establecimiento.plan_piso_tecnologico || "",
    tipo_mejora: establecimiento.tipo_mejora || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const result = await updateConnectivity(establecimiento.id, formData)
      if (result.success) {
        setMessage("Guardado exitosamente")
        router.refresh()
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
    <div className="space-y-6 py-4">
      <div className="border-b-2 border-gray-300 pb-2 mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Plan de Enlace</h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="plan_enlace">Plan de Enlace</Label>
          <Input
            id="plan_enlace"
            value={formData.plan_enlace}
            onChange={(e) => setFormData({ ...formData, plan_enlace: e.target.value })}
          />
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-2 mb-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          PNCE - Plan Nacional de Conectividad Escolar
        </h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="pnce_estado">PNCE (Estado)</Label>
          <Input
            id="pnce_estado"
            value={formData.pnce_estado}
            onChange={(e) => setFormData({ ...formData, pnce_estado: e.target.value })}
            placeholder="Estado del Plan Nacional de Conectividad Escolar"
          />
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-2 mb-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Provincia de Buenos Aires - Conectividad
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pba_grupo_1_estado">PBA - Grupo 1 (Estado)</Label>
          <Input
            id="pba_grupo_1_estado"
            value={formData.pba_grupo_1_estado}
            onChange={(e) => setFormData({ ...formData, pba_grupo_1_estado: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pba_2019_estado">PBA 2019 (Estado)</Label>
          <Input
            id="pba_2019_estado"
            value={formData.pba_2019_estado}
            onChange={(e) => setFormData({ ...formData, pba_2019_estado: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pba_grupo_2_a_estado">PBA - Grupo 2-A (Estado)</Label>
          <Input
            id="pba_grupo_2_a_estado"
            value={formData.pba_grupo_2_a_estado}
            onChange={(e) => setFormData({ ...formData, pba_grupo_2_a_estado: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado_instalacion_pba">Estado General PBA</Label>
          <Input
            id="estado_instalacion_pba"
            value={formData.estado_instalacion_pba}
            onChange={(e) => setFormData({ ...formData, estado_instalacion_pba: e.target.value })}
          />
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-2 mb-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Infraestructura Tecnológica
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plan_piso_tecnologico">Plan Piso Tecnológico</Label>
          <Input
            id="plan_piso_tecnologico"
            value={formData.plan_piso_tecnologico}
            onChange={(e) => setFormData({ ...formData, plan_piso_tecnologico: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_mejora">Mejoras de Infraestructura</Label>
          <Input
            id="tipo_mejora"
            value={formData.tipo_mejora}
            onChange={(e) => setFormData({ ...formData, tipo_mejora: e.target.value })}
            placeholder="Tipo de mejora realizada"
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}

      <Button onClick={handleSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}
