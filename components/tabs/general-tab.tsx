"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateGeneral } from "@/app/actions/update-general"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Establecimiento = {
  id: string
  cue: number
  predio: number | null
  nombre: string
  alias: string | null
  distrito: string
  ciudad: string
  direccion: string
  lat: number | null
  lon: number | null
  fed_a_cargo: string
  tipo_establecimiento: string
  ambito: string
  [key: string]: unknown
}

export function GeneralTab({
  establecimiento,
  isGovernmentBuilding = false,
}: { establecimiento: Establecimiento; isGovernmentBuilding?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: establecimiento.nombre,
    alias: establecimiento.alias || "",
    distrito: establecimiento.distrito,
    ciudad: establecimiento.ciudad,
    direccion: establecimiento.direccion,
    lat: establecimiento.lat?.toString() || "",
    lon: establecimiento.lon?.toString() || "",
    fed_a_cargo: establecimiento.fed_a_cargo,
    tipo_establecimiento: establecimiento.tipo_establecimiento,
    ambito: establecimiento.ambito,
  })
  const [isSaving, setIsSaving] = useState(false)

  const distritos = ["BERISSO", "BRANDSEN", "ENSENADA", "LA PLATA", "MAGDALENA", "PUNTA INDIO"]
  const feds = [
    "NONE",
    "Sin FED asignado",
    "Andrés Guzmán",
    "Carlos Franco",
    "Daniela Cortes",
    "Jorge Pérez",
    "Macarena Duarte Buschiazzo",
    "Marcos Pettiná",
    "Silvio Ridolfi",
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const dataToSave = {
        ...formData,
        fed_a_cargo: formData.fed_a_cargo === "NONE" ? null : formData.fed_a_cargo,
      }
      const result = await updateGeneral(establecimiento.id, dataToSave)
      if (result.success) {
        toast({
          title: "Cambios guardados",
          description: "La información general se actualizó correctamente",
          className: "bg-green-500 text-white border-green-600",
        })
        router.refresh()
      } else {
        toast({
          title: "Error al guardar",
          description: result.error || "No se pudieron guardar los cambios",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="border-b-2 border-gray-300 pb-2 mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Identificación</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* CUE - Read only */}
        <div className="space-y-2">
          <Label htmlFor="cue" className="flex items-center gap-2">
            CUE <Lock className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input id="cue" value={establecimiento.cue} disabled className="bg-muted cursor-not-allowed" />
          <p className="text-xs text-muted-foreground">Campo no editable</p>
        </div>

        {/* PREDIO - Read only */}
        <div className="space-y-2">
          <Label htmlFor="predio" className="flex items-center gap-2">
            Predio <Lock className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input
            id="predio"
            value={establecimiento.predio || "Sin datos"}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">Campo no editable</p>
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-2 mb-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Información General</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="alias">Alias</Label>
          <Input
            id="alias"
            value={formData.alias}
            onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distrito">Distrito</Label>
          <Select value={formData.distrito} onValueChange={(value) => setFormData({ ...formData, distrito: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un distrito" />
            </SelectTrigger>
            <SelectContent>
              {distritos.map((distrito) => (
                <SelectItem key={distrito} value={distrito}>
                  {distrito}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            value={formData.ciudad}
            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-2 mb-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Coordenadas</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitud</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lon">Longitud</Label>
          <Input
            id="lon"
            type="number"
            step="any"
            value={formData.lon}
            onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
          />
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-2 mb-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Clasificación</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {!isGovernmentBuilding && (
          <div className="space-y-2">
            <Label htmlFor="fed_a_cargo">FED Asignado</Label>
            <Select
              value={formData.fed_a_cargo || "NONE"}
              onValueChange={(value) => setFormData({ ...formData, fed_a_cargo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona FED" />
              </SelectTrigger>
              <SelectContent>
                {feds.map((fed) => (
                  <SelectItem key={fed} value={fed}>
                    {fed === "NONE" ? "Dejar vacío" : fed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tipo_establecimiento">Tipo</Label>
          <Input
            id="tipo_establecimiento"
            value={formData.tipo_establecimiento}
            onChange={(e) => setFormData({ ...formData, tipo_establecimiento: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ambito">Ámbito</Label>
          <Input
            id="ambito"
            value={formData.ambito}
            onChange={(e) => setFormData({ ...formData, ambito: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}
