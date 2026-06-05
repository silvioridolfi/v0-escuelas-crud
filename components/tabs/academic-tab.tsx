"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateAcademic } from "@/app/actions/update-academic"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Establecimiento = {
  id: string
  nivel: string | null
  modalidad: string | null
  matricula: number | null
  varones: number | null
  mujeres: number | null
  secciones: number | null
  turnos: string | null
  [key: string]: unknown
}

export function AcademicTab({ establecimiento }: { establecimiento: Establecimiento }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nivel: establecimiento.nivel ?? "",
    modalidad: establecimiento.modalidad ?? "",
    matricula: establecimiento.matricula?.toString() ?? "",
    varones: establecimiento.varones?.toString() ?? "",
    mujeres: establecimiento.mujeres?.toString() ?? "",
    secciones: establecimiento.secciones?.toString() ?? "",
    turnos: establecimiento.turnos ?? "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateAcademic(establecimiento.id, formData)
      if (result.success) {
        toast({
          title: "✓ Cambios guardados",
          description: "Los datos académicos se actualizaron correctamente",
          className: "bg-green-50 border-green-200 text-green-900",
          duration: 3000,
        })
        router.refresh()
      } else {
        toast({
          title: "Error al guardar",
          description: result.error || "No se pudieron guardar los cambios",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al guardar",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nivel">Nivel</Label>
          <Input
            id="nivel"
            value={formData.nivel}
            onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modalidad">Modalidad</Label>
          <Input
            id="modalidad"
            value={formData.modalidad}
            onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="matricula">Matrícula</Label>
          <Input
            id="matricula"
            type="number"
            value={formData.matricula}
            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="varones">Varones</Label>
          <Input
            id="varones"
            type="number"
            value={formData.varones}
            onChange={(e) => setFormData({ ...formData, varones: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mujeres">Mujeres</Label>
          <Input
            id="mujeres"
            type="number"
            value={formData.mujeres}
            onChange={(e) => setFormData({ ...formData, mujeres: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secciones">Secciones</Label>
          <Input
            id="secciones"
            type="number"
            value={formData.secciones}
            onChange={(e) => setFormData({ ...formData, secciones: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="turnos">Turnos</Label>
          <Input
            id="turnos"
            value={formData.turnos}
            onChange={(e) => setFormData({ ...formData, turnos: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}
