"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, Building } from "lucide-react"
import { useRouter } from "next/navigation"
import { createEstablishment } from "@/app/actions/create-establishment"
import { createOrganismoDescentralizado } from "@/app/actions/create-organismo"

const DISTRITOS = ["BERISSO", "BRANDSEN", "ENSENADA", "LA PLATA", "MAGDALENA", "PUNTA INDIO"]

const FEDS = [
  "Andrés Guzmán",
  "Carlos Franco",
  "Daniela Cortes",
  "Jorge Pérez",
  "Macarena Duarte Buschiazzo",
  "Marcos Pettiná",
  "Silvio Ridolfi",
  "Sin FED asignado",
]

const TIPOS_ORGANIZACION = ["Jefatura Regional", "Jefatura Distrital", "Organismo Descentralizado"]

export function CreateEstablishmentForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"establecimiento" | "organismo">("establecimiento")

  // Form data para establecimiento educativo
  const [formData, setFormData] = useState({
    cue: "",
    predio: "",
    nombre: "",
    distrito: "BERISSO",
    ciudad: "",
    direccion: "",
    nivel: "",
    modalidad: "",
    fed_a_cargo: "",
  })

  // Form data para organismo descentralizado
  const [organismoData, setOrganismoData] = useState({
    codigo: "",
    tipo_organizacion: "Jefatura Distrital",
    dependencia: "Oficial",
    nombre: "",
    distrito: "BERISSO",
    domicilio: "",
    localidad: "",
    telefono: "",
    contacto_nombre: "",
    contacto_apellido: "",
    contacto_cargo: "",
    email: "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleEstablishmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const result = await createEstablishment({
        cue: Number.parseInt(formData.cue),
        predio: formData.predio ? Number.parseInt(formData.predio) : null,
        nombre: formData.nombre,
        distrito: formData.distrito,
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        nivel: formData.nivel || null,
        modalidad: formData.modalidad || null,
        fed_a_cargo: formData.fed_a_cargo && formData.fed_a_cargo !== "NONE" ? formData.fed_a_cargo : null,
      })

      if (result.success && result.id) {
        router.push(`/establecimientos/${result.id}`)
      } else {
        setError(result.error || "Error al crear el establecimiento")
      }
    } catch (err) {
      setError("Error inesperado")
    } finally {
      setIsSaving(false)
    }
  }

  const handleOrganismoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const result = await createOrganismoDescentralizado({
        codigo: organismoData.codigo,
        tipo_organizacion: organismoData.tipo_organizacion,
        dependencia: organismoData.dependencia,
        nombre: organismoData.nombre || null,
        distrito: organismoData.distrito,
        domicilio: organismoData.domicilio,
        localidad: organismoData.localidad,
        telefono: organismoData.telefono || null,
        contacto_nombre: organismoData.contacto_nombre || null,
        contacto_apellido: organismoData.contacto_apellido || null,
        contacto_cargo: organismoData.contacto_cargo || null,
        email: organismoData.email || null,
      })

      if (result.success && result.id) {
        router.push(`/organismos/${result.id}`)
      } else {
        setError(result.error || "Error al crear el organismo")
      }
    } catch (err) {
      setError("Error inesperado")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto px-4 py-6">
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
                <Building2 className="h-6 w-6 text-[#417099]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold leading-tight text-white">Nueva Entidad</h1>
                <p className="text-sm text-white/90">Crear establecimiento educativo u organismo descentralizado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-3xl shadow-lg">
          <CardHeader>
            <CardTitle>Seleccione el tipo de entidad</CardTitle>
            <CardDescription>Elija entre establecimiento educativo u organismo descentralizado</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "establecimiento" | "organismo")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="establecimiento" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Establecimiento Educativo
                </TabsTrigger>
                <TabsTrigger value="organismo" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Organismo Descentralizado
                </TabsTrigger>
              </TabsList>

              {/* Establecimiento Educativo Form */}
              <TabsContent value="establecimiento">
                <form onSubmit={handleEstablishmentSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cue">
                        CUE <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cue"
                        type="number"
                        required
                        value={formData.cue}
                        onChange={(e) => setFormData({ ...formData, cue: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">No podrá modificarse después</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="predio">Predio</Label>
                      <Input
                        id="predio"
                        type="number"
                        value={formData.predio}
                        onChange={(e) => setFormData({ ...formData, predio: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">No podrá modificarse después</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nombre">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="distrito">
                        Distrito <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        required
                        value={formData.distrito}
                        onValueChange={(value) => setFormData({ ...formData, distrito: value })}
                      >
                        <SelectTrigger id="distrito">
                          <SelectValue placeholder="Seleccionar distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRITOS.map((distrito) => (
                            <SelectItem key={distrito} value={distrito}>
                              {distrito}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ciudad">
                        Ciudad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ciudad"
                        required
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="direccion">
                        Dirección <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="direccion"
                        required
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      />
                    </div>

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

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fed_a_cargo">FED Asignado</Label>
                      <Select
                        value={formData.fed_a_cargo}
                        onValueChange={(value) => setFormData({ ...formData, fed_a_cargo: value })}
                      >
                        <SelectTrigger id="fed_a_cargo">
                          <SelectValue placeholder="Seleccionar FED (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">Dejar vacío</SelectItem>
                          {FEDS.map((fed) => (
                            <SelectItem key={fed} value={fed}>
                              {fed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSaving}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-[#e81f76] hover:bg-[#c71963]">
                      {isSaving ? "Creando..." : "Crear Establecimiento"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Organismo Descentralizado Form */}
              <TabsContent value="organismo">
                <form onSubmit={handleOrganismoSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">
                        Código Provincial <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="codigo"
                        required
                        placeholder="jr01, jd001, etc."
                        value={organismoData.codigo}
                        onChange={(e) => setOrganismoData({ ...organismoData, codigo: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Código único provincial (ej: jr01, jd001)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo_org">
                        Tipo de Organización <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        required
                        value={organismoData.tipo_organizacion}
                        onValueChange={(value) => setOrganismoData({ ...organismoData, tipo_organizacion: value })}
                      >
                        <SelectTrigger id="tipo_org">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_ORGANIZACION.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nombre_org">Nombre</Label>
                      <Input
                        id="nombre_org"
                        placeholder="JEFATURA DE REGION - INSP. GRAL."
                        value={organismoData.nombre}
                        onChange={(e) => setOrganismoData({ ...organismoData, nombre: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="distrito_org">
                        Distrito <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        required
                        value={organismoData.distrito}
                        onValueChange={(value) => setOrganismoData({ ...organismoData, distrito: value })}
                      >
                        <SelectTrigger id="distrito_org">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRITOS.map((distrito) => (
                            <SelectItem key={distrito} value={distrito}>
                              {distrito}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="localidad">
                        Localidad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="localidad"
                        required
                        value={organismoData.localidad}
                        onChange={(e) => setOrganismoData({ ...organismoData, localidad: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="domicilio">
                        Domicilio <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="domicilio"
                        required
                        placeholder="50 Nº 881"
                        value={organismoData.domicilio}
                        onChange={(e) => setOrganismoData({ ...organismoData, domicilio: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="221 4247260, 221 4824801"
                        value={organismoData.telefono}
                        onChange={(e) => setOrganismoData({ ...organismoData, telefono: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contacto_nombre">Contacto - Nombre</Label>
                      <Input
                        id="contacto_nombre"
                        value={organismoData.contacto_nombre}
                        onChange={(e) => setOrganismoData({ ...organismoData, contacto_nombre: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contacto_apellido">Contacto - Apellido</Label>
                      <Input
                        id="contacto_apellido"
                        value={organismoData.contacto_apellido}
                        onChange={(e) => setOrganismoData({ ...organismoData, contacto_apellido: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contacto_cargo">Contacto - Cargo</Label>
                      <Input
                        id="contacto_cargo"
                        value={organismoData.contacto_cargo}
                        onChange={(e) => setOrganismoData({ ...organismoData, contacto_cargo: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={organismoData.email}
                        onChange={(e) => setOrganismoData({ ...organismoData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSaving}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-[#417099] hover:bg-[#2f5570]">
                      {isSaving ? "Creando..." : "Crear Organismo"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
