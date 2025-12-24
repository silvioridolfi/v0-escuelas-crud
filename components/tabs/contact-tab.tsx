"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createContact, updateContact, deleteContact } from "@/app/actions/contact-actions"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, X } from "lucide-react"

type Contacto = {
  id: string
  cue: number
  nombre: string | null
  apellido: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
  distrito: string | null
  fed_a_cargo: string | null
}

export function ContactTab({
  cue,
  contactos,
  distrito,
  fedACargo,
}: {
  cue: number
  contactos: Contacto[]
  distrito: string
  fedACargo: string
}) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cargo: "",
    telefono: "",
    correo: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleEdit = (contacto: Contacto) => {
    setEditingId(contacto.id)
    setFormData({
      nombre: contacto.nombre || "",
      apellido: contacto.apellido || "",
      cargo: contacto.cargo || "",
      telefono: contacto.telefono || "",
      correo: contacto.correo || "",
    })
    setIsCreating(false)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      nombre: "",
      apellido: "",
      cargo: "",
      telefono: "",
      correo: "",
    })
    setMessage("")
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      let result
      if (editingId) {
        result = await updateContact(editingId, formData)
      } else {
        result = await createContact(cue, formData)
      }

      if (result.success) {
        setMessage("Cambios guardados exitosamente")
        handleCancelEdit()
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

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este contacto?")) return

    setIsSaving(true)
    setMessage("")
    try {
      const result = await deleteContact(id)
      if (result.success) {
        setMessage("Contacto eliminado")
        router.refresh()
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      setMessage("Error al eliminar")
    } finally {
      setIsSaving(false)
    }
  }

  const startCreating = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      nombre: "",
      apellido: "",
      cargo: "",
      telefono: "",
      correo: "",
    })
  }

  return (
    <div className="space-y-6 py-4">
      {/* List existing contacts */}
      {contactos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contactos Registrados</h3>
            {!isCreating && !editingId && (
              <Button onClick={startCreating} size="sm" className="bg-[#e81f76] hover:bg-[#c71963]">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Contacto
              </Button>
            )}
          </div>

          {contactos.map((contacto) => (
            <Card key={contacto.id} className={editingId === contacto.id ? "border-[#00AEC3]" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {contacto.nombre} {contacto.apellido}
                    </CardTitle>
                    {contacto.cargo && <CardDescription>{contacto.cargo}</CardDescription>}
                  </div>
                  {editingId !== contacto.id && !isCreating && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(contacto)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-[#417099]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(contacto.id)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        disabled={isSaving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              {editingId === contacto.id && (
                <CardContent>
                  <ContactForm
                    formData={formData}
                    setFormData={setFormData}
                    isSaving={isSaving}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                    message={message}
                    isEditing={true}
                  />
                </CardContent>
              )}
              {editingId !== contacto.id && (
                <CardContent className="space-y-2 text-sm">
                  {contacto.telefono && (
                    <p>
                      <span className="font-medium">Teléfono:</span> {contacto.telefono}
                    </p>
                  )}
                  {contacto.correo && (
                    <p>
                      <span className="font-medium">Email:</span> {contacto.correo}
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create new contact form */}
      {isCreating && (
        <Card className="border-[#e81f76]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Nuevo Contacto</CardTitle>
              <Button onClick={handleCancelEdit} size="icon" variant="ghost" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ContactForm
              formData={formData}
              setFormData={setFormData}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              message={message}
              isEditing={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {contactos.length === 0 && !isCreating && (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
              <CardTitle className="mb-2">No hay contactos registrados</CardTitle>
              <CardDescription className="mb-4">Crea un contacto para este establecimiento</CardDescription>
              <Button onClick={startCreating} className="bg-[#e81f76] hover:bg-[#c71963]">
                <Plus className="mr-2 h-4 w-4" />
                Crear Contacto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {message && contactos.length > 0 && !isCreating && !editingId && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}
    </div>
  )
}

function ContactForm({
  formData,
  setFormData,
  isSaving,
  onSave,
  onCancel,
  message,
  isEditing,
}: {
  formData: {
    nombre: string
    apellido: string
    cargo: string
    telefono: string
    correo: string
  }
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>
  isSaving: boolean
  onSave: () => void
  onCancel: () => void
  message: string
  isEditing: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input
            id="cargo"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
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
          <Label htmlFor="correo">Correo Electrónico</Label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}

      <div className="flex gap-2">
        <Button onClick={onSave} disabled={isSaving} className="bg-[#00AEC3] hover:bg-[#0098ad]">
          {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Contacto"}
        </Button>
        <Button onClick={onCancel} variant="outline" disabled={isSaving}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
