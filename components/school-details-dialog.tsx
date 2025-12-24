"use client"

import { useState, useEffect } from "react"
import { X, Save, MapPin, Building2, Users, Wifi, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type Establecimiento = {
  id: string
  cue: number
  nombre: string
  distrito: string
  ciudad: string
  direccion: string
  nivel: string
  modalidad: string
  tipo_establecimiento: string
  ambito: string
  matricula: number
  varones: number
  mujeres: number
  secciones: number
  fed_a_cargo: string
  turnos: string
  plan_enlace: string
  proveedor_internet_pnce: string
  fecha_instalacion_pnce: string
  lat: number
  lon: number
  observaciones: string
  [key: string]: unknown
}

interface SchoolDetailsDialogProps {
  school: Establecimiento | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SchoolDetailsDialog({ school, open, onOpenChange }: SchoolDetailsDialogProps) {
  const [formData, setFormData] = useState<Partial<Establecimiento>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (school) {
      setFormData(school)
    }
  }, [school])

  const handleInputChange = (field: keyof Establecimiento, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!school) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from("establecimientos").update(formData).eq("id", school.id)

      if (error) throw error

      toast({
        title: "Cambios guardados",
        description: "Los datos del establecimiento se actualizaron correctamente.",
      })

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error saving school:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!school) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-balance">{school.nombre}</DialogTitle>
          <DialogDescription>
            CUE: {school.cue} • {school.fed_a_cargo}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Building2 className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="ubicacion">
              <MapPin className="mr-2 h-4 w-4" />
              Ubicación
            </TabsTrigger>
            <TabsTrigger value="matricula">
              <Users className="mr-2 h-4 w-4" />
              Matrícula
            </TabsTrigger>
            <TabsTrigger value="conectividad">
              <Wifi className="mr-2 h-4 w-4" />
              Conectividad
            </TabsTrigger>
            <TabsTrigger value="otros">
              <FileText className="mr-2 h-4 w-4" />
              Otros
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del establecimiento</Label>
                <Input
                  id="nombre"
                  value={formData.nombre || ""}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cue">CUE</Label>
                  <Input
                    id="cue"
                    type="number"
                    value={formData.cue || ""}
                    onChange={(e) => handleInputChange("cue", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fed_a_cargo">FED a cargo</Label>
                  <Input
                    id="fed_a_cargo"
                    value={formData.fed_a_cargo || ""}
                    onChange={(e) => handleInputChange("fed_a_cargo", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nivel">Nivel</Label>
                  <Input
                    id="nivel"
                    value={formData.nivel || ""}
                    onChange={(e) => handleInputChange("nivel", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modalidad">Modalidad</Label>
                  <Input
                    id="modalidad"
                    value={formData.modalidad || ""}
                    onChange={(e) => handleInputChange("modalidad", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo_establecimiento">Tipo</Label>
                  <Input
                    id="tipo_establecimiento"
                    value={formData.tipo_establecimiento || ""}
                    onChange={(e) => handleInputChange("tipo_establecimiento", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ambito">Ámbito</Label>
                  <Input
                    id="ambito"
                    value={formData.ambito || ""}
                    onChange={(e) => handleInputChange("ambito", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="turnos">Turnos</Label>
                  <Input
                    id="turnos"
                    value={formData.turnos || ""}
                    onChange={(e) => handleInputChange("turnos", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Ubicacion Tab */}
          <TabsContent value="ubicacion" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion || ""}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={formData.ciudad || ""}
                    onChange={(e) => handleInputChange("ciudad", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input
                    id="distrito"
                    value={formData.distrito || ""}
                    onChange={(e) => handleInputChange("distrito", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lat">Latitud</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    value={formData.lat || ""}
                    onChange={(e) => handleInputChange("lat", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lon">Longitud</Label>
                  <Input
                    id="lon"
                    type="number"
                    step="0.000001"
                    value={formData.lon || ""}
                    onChange={(e) => handleInputChange("lon", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Matricula Tab */}
          <TabsContent value="matricula" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="matricula">Matrícula Total</Label>
                  <Input
                    id="matricula"
                    type="number"
                    value={formData.matricula || 0}
                    onChange={(e) => handleInputChange("matricula", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="varones">Varones</Label>
                  <Input
                    id="varones"
                    type="number"
                    value={formData.varones || 0}
                    onChange={(e) => handleInputChange("varones", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mujeres">Mujeres</Label>
                  <Input
                    id="mujeres"
                    type="number"
                    value={formData.mujeres || 0}
                    onChange={(e) => handleInputChange("mujeres", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="secciones">Secciones</Label>
                <Input
                  id="secciones"
                  type="number"
                  value={formData.secciones || 0}
                  onChange={(e) => handleInputChange("secciones", Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Conectividad Tab */}
          <TabsContent value="conectividad" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plan_enlace">Plan de Enlace</Label>
                <Input
                  id="plan_enlace"
                  value={formData.plan_enlace || ""}
                  onChange={(e) => handleInputChange("plan_enlace", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="proveedor_internet_pnce">Proveedor PNCE</Label>
                  <Input
                    id="proveedor_internet_pnce"
                    value={formData.proveedor_internet_pnce || ""}
                    onChange={(e) => handleInputChange("proveedor_internet_pnce", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fecha_instalacion_pnce">Fecha Instalación PNCE</Label>
                  <Input
                    id="fecha_instalacion_pnce"
                    value={formData.fecha_instalacion_pnce || ""}
                    onChange={(e) => handleInputChange("fecha_instalacion_pnce", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Otros Tab */}
          <TabsContent value="otros" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  rows={6}
                  value={formData.observaciones || ""}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Notas adicionales sobre el establecimiento..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
