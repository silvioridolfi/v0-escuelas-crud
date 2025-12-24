"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateAcademic } from "@/app/actions/update-academic"
import { useRouter } from "next/navigation"

type Establecimiento = {
  id: string
  nivel: string
  modalidad: string
  matricula: number
  varones: number
  mujeres: number
  secciones: number
  turnos: string | null
  [key: string]: unknown
}

export function AcademicTab({ establecimiento }: { establecimiento: Establecimiento }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nivel: establecimiento.nivel,
    modalidad: establecimiento.modalidad,
    matricula: establecimiento.matricula.toString(),
    varones: establecimiento.varones.toString(),
    mujeres: establecimiento.mujeres.toString(),
    secciones: establecimiento.secciones.toString(),
    turnos: establecimiento.turnos || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const result = await updateAcademic(establecimiento.id, formData)
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

      {message && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}

      <Button onClick={handleSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}
