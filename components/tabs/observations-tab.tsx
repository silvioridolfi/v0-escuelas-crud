"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateObservations } from "@/app/actions/update-observations"
import { useRouter } from "next/navigation"
import type { Establecimiento as EstablecimientoFull } from "@/lib/establecimiento"
import { EditSectionToggle } from "@/components/tabs/edit-section-toggle"

type Establecimiento = Pick<EstablecimientoFull, "id" | "observaciones">

export function ObservationsTab({ establecimiento }: { establecimiento: Establecimiento }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [observaciones, setObservaciones] = useState(establecimiento.observaciones || "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const result = await updateObservations(establecimiento.id, observaciones)
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
      <EditSectionToggle isEditing={isEditing} onToggle={() => setIsEditing((v) => !v)} />

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={8}
          placeholder="Ingrese observaciones adicionales..."
          disabled={!isEditing}
        />
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
