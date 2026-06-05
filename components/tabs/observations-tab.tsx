"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateObservations } from "@/app/actions/update-observations"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Establecimiento = {
  id: string
  observaciones: string | null
  [key: string]: unknown
}

export function ObservationsTab({ establecimiento }: { establecimiento: Establecimiento }) {
  const router = useRouter()
  const { toast } = useToast()
  const [observaciones, setObservaciones] = useState(establecimiento.observaciones || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateObservations(establecimiento.id, observaciones)
      if (result.success) {
        toast({
          title: "✓ Cambios guardados",
          description: "Las observaciones se guardaron correctamente",
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
      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={8}
          placeholder="Ingresá observaciones adicionales sobre el establecimiento..."
        />
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}
