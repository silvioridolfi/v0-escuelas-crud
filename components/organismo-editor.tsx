"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Building, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateOrganismoDescentralizado } from "@/app/actions/update-organismo"
import { deleteOrganismo } from "@/app/actions/delete-organismo"
import { useToast } from "@/hooks/use-toast"

type Organismo = {
  id: string
  codigo: string
  tipo_organizacion: string
  subtipo_organizacion: string | null // Added subtipo field
  dependencia: string
  nombre: string | null
  distrito: string
  domicilio: string
  localidad: string
  telefono: string | null
  contacto_nombre: string | null
  contacto_apellido: string | null
  contacto_cargo: string | null
  email: string | null
  latitud: number | null
  longitud: number | null
  observaciones: string | null
}

const SUBTIPOS_ORGANIZACION = ["Jefatura Regional", "Jefatura Distrital"]

export function OrganismoEditor({ organismo }: { organismo: Organismo }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    codigo: organismo.codigo,
    tipo_organizacion: organismo.tipo_organizacion,
    subtipo_organizacion: organismo.subtipo_organizacion || "",
    dependencia: organismo.dependencia,
    nombre: organismo.nombre || "",
    distrito: organismo.distrito,
    domicilio: organismo.domicilio,
    localidad: organismo.localidad,
    telefono: organismo.telefono || "",
    contacto_nombre: organismo.contacto_nombre || "",
    contacto_apellido: organismo.contacto_apellido || "",
    contacto_cargo: organismo.contacto_cargo || "",
    email: organismo.email || "",
    latitud: organismo.latitud?.toString() || "",
    longitud: organismo.longitud?.toString() || "",
    observaciones: organismo.observaciones || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    const dataToSave = {
      ...formData,
      latitud: formData.latitud ? Number.parseFloat(formData.latitud) : null,
      longitud: formData.longitud ? Number.parseFloat(formData.longitud) : null,
      subtipo_organizacion: formData.subtipo_organizacion || null,
    }

    const result = await updateOrganismoDescentralizado(organismo.id, dataToSave)

    if (result.success) {
      toast({
        title: "✓ Cambios guardados",
        description: "Los cambios se guardaron exitosamente en la base de datos",
        className: "bg-green-50 border-green-200 text-green-900",
        duration: 3000,
      })
    } else {
      toast({
        title: "Error al guardar",
        description: result.error || "Ocurrió un error al guardar los cambios",
        variant: "destructive",
        duration: 5000,
      })
    }

    setIsSaving(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteOrganismo(organismo.id)

    if (result.success) {
      router.push("/")
    } else {
      alert(result.error || "Error al eliminar el organismo")
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md">
                  <Building className="h-6 w-6 text-[#417099]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold leading-tight text-white">
                    {organismo.nombre || organismo.tipo_organizacion}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm text-white/90">Código Provincial: {organismo.codigo}</p>
                    <Badge variant="outline" className="border-white/50 bg-white/90 text-slate-700">
                      {organismo.tipo_organizacion}
                    </Badge>
                    {organismo.subtipo_organizacion === "Jefatura Regional" && (
                      <Badge className="bg-purple-600 text-white border-0">Jefatura Regional</Badge>
                    )}
                    {organismo.subtipo_organizacion === "Jefatura Distrital" && (
                      <Badge className="bg-indigo-600 text-white border-0">Jefatura Distrital</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700 shadow-md"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-white/90 text-[#417099] hover:bg-white shadow-md"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 text-foreground">Información General</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código Provincial</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      placeholder="Ej: jr01, jd001, jd113"
                    />
                    <p className="text-xs text-muted-foreground">Código único de identificación provincial</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Organismo</Label>
                    <Input id="tipo" value="Organismo Descentralizado" disabled className="bg-slate-50" />
                    <p className="text-xs text-muted-foreground">Campo fijo para este tipo de entidad</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtipo">Sub Tipo de Organismo</Label>
                    <Select
                      value={formData.subtipo_organizacion || ""}
                      onValueChange={(value) => setFormData({ ...formData, subtipo_organizacion: value || null })}
                    >
                      <SelectTrigger id="subtipo">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBTIPOS_ORGANIZACION.map((subtipo) => (
                          <SelectItem key={subtipo} value={subtipo}>
                            {subtipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distrito">Distrito</Label>
                    <Input
                      id="distrito"
                      value={formData.distrito}
                      onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localidad">Localidad</Label>
                    <Input
                      id="localidad"
                      value={formData.localidad}
                      onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="domicilio">Domicilio</Label>
                    <Input
                      id="domicilio"
                      value={formData.domicilio}
                      onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 pt-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Contacto</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contacto_nombre">Nombre</Label>
                    <Input
                      id="contacto_nombre"
                      value={formData.contacto_nombre}
                      onChange={(e) => setFormData({ ...formData, contacto_nombre: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contacto_apellido">Apellido</Label>
                    <Input
                      id="contacto_apellido"
                      value={formData.contacto_apellido}
                      onChange={(e) => setFormData({ ...formData, contacto_apellido: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contacto_cargo">Cargo</Label>
                    <Input
                      id="contacto_cargo"
                      value={formData.contacto_cargo}
                      onChange={(e) => setFormData({ ...formData, contacto_cargo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 pt-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Ubicación</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitud">Latitud</Label>
                    <Input
                      id="latitud"
                      type="text"
                      placeholder="-34.12345678"
                      value={formData.latitud}
                      onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Coordenada geográfica en formato decimal</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitud">Longitud</Label>
                    <Input
                      id="longitud"
                      type="text"
                      placeholder="-58.12345678"
                      value={formData.longitud}
                      onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Coordenada geográfica en formato decimal</p>
                  </div>
                </div>
                {formData.latitud &&
                  formData.longitud &&
                  !isNaN(Number(formData.latitud)) &&
                  !isNaN(Number(formData.longitud)) && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <a
                          href={`https://www.google.com/maps?q=${formData.latitud},${formData.longitud}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-600"
                        >
                          Ver ubicación en Google Maps
                        </a>
                      </p>
                    </div>
                  )}
              </div>

              <div className="border-t-2 border-gray-300 pt-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Observaciones</h2>
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Notas adicionales</Label>
                  <Textarea
                    id="observaciones"
                    rows={4}
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">¿Eliminar Organismo Descentralizado?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Estás por eliminar permanentemente el siguiente organismo:</p>
              <p className="font-semibold text-foreground">
                {organismo.nombre || organismo.tipo_organizacion} (Código: {organismo.codigo})
              </p>
              <p className="font-bold text-red-600">
                Esta acción eliminará todos los registros de la base de datos y no se puede deshacer.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Eliminando..." : "Sí, Eliminar Permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
