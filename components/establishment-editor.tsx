"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, FileText, Wifi, GraduationCap, Users, FileWarning, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { GeneralTab } from "@/components/tabs/general-tab"
import { ConnectivityTab } from "@/components/tabs/connectivity-tab"
import { AcademicTab } from "@/components/tabs/academic-tab"
import { ObservationsTab } from "@/components/tabs/observations-tab"
import { ContactTab } from "@/components/tabs/contact-tab"
import { deleteEstablishment } from "@/app/actions/delete-establishment"

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
  nivel: string
  modalidad: string
  tipo_establecimiento: string
  ambito: string
  matricula: number
  varones: number
  mujeres: number
  secciones: number
  turnos: string | null
  fed_a_cargo: string
  plan_enlace: string | null
  plan_piso_tecnologico: string | null
  observaciones: string | null
  es_establecimiento_educativo: boolean // Added flag for government buildings
  [key: string]: unknown
}

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

export function EstablishmentEditor({
  establecimiento,
  contactos,
}: {
  establecimiento: Establecimiento
  contactos: Contacto[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isGovernmentBuilding = establecimiento.es_establecimiento_educativo === false

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteEstablishment(establecimiento.id)

    if (result.success) {
      router.push("/")
    } else {
      alert(result.error || "Error al eliminar el establecimiento")
      setIsDeleting(false)
    }
  }

  const allTabsConfig = [
    {
      value: "general",
      label: "General",
      icon: FileText,
      color: "text-[#417099]",
      bgColor: "bg-[#417099]/10",
      borderColor: "border-[#417099]",
      showForGovBuilding: true,
    },
    {
      value: "connectivity",
      label: "Conectividad",
      icon: Wifi,
      color: "text-[#00AEC3]",
      bgColor: "bg-[#00AEC3]/10",
      borderColor: "border-[#00AEC3]",
      showForGovBuilding: false,
    },
    {
      value: "academic",
      label: "Académico",
      icon: GraduationCap,
      color: "text-[#e81f76]",
      bgColor: "bg-[#e81f76]/10",
      borderColor: "border-[#e81f76]",
      showForGovBuilding: false,
    },
    {
      value: "contact",
      label: "Contacto",
      icon: Users,
      color: "text-[#417099]",
      bgColor: "bg-[#417099]/10",
      borderColor: "border-[#417099]",
      showForGovBuilding: true,
    },
    {
      value: "observations",
      label: "Observaciones",
      icon: FileWarning,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      showForGovBuilding: true,
    },
  ]

  const tabsConfig = isGovernmentBuilding ? allTabsConfig.filter((tab) => tab.showForGovBuilding) : allTabsConfig

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold leading-tight text-white">{establecimiento.nombre}</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-white/90">CUE: {establecimiento.cue}</p>
                {isGovernmentBuilding && (
                  <Badge variant="secondary" className="bg-amber-500/90 text-white hover:bg-amber-600">
                    Edificio Gubernamental
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700 shadow-md"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Establecimiento
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden border-slate-200 bg-white shadow-xl">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-xl text-slate-900">Detalles del Establecimiento</CardTitle>
            <CardDescription className="text-slate-600">Edita la información organizadas por secciones</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div
                className={`mb-6 grid gap-3 overflow-x-auto border-b-2 border-slate-200 pb-2 ${
                  isGovernmentBuilding ? "grid-cols-3" : "grid-cols-2 md:grid-cols-5"
                }`}
              >
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.value
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`
                        group relative flex items-center gap-2 rounded-t-lg px-4 py-3 font-medium transition-all
                        ${
                          isActive
                            ? `${tab.bgColor} ${tab.color} shadow-md ring-2 ${tab.borderColor} ring-opacity-50`
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      {isActive && (
                        <div
                          className={`absolute left-0 right-0 top-0 h-1 rounded-t-lg ${tab.borderColor.replace("border-", "bg-")}`}
                        />
                      )}

                      <Icon
                        className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                      />
                      <span className="whitespace-nowrap text-sm">{tab.label}</span>

                      {isActive && (
                        <div className={`ml-1 h-2 w-2 rounded-full ${tab.borderColor.replace("border-", "bg-")}`} />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="rounded-lg bg-slate-50/30 p-6">
                <TabsContent value="general" className="m-0">
                  <GeneralTab establecimiento={establecimiento} isGovernmentBuilding={isGovernmentBuilding} />
                </TabsContent>
                {!isGovernmentBuilding && (
                  <>
                    <TabsContent value="connectivity" className="m-0">
                      <ConnectivityTab establecimiento={establecimiento} />
                    </TabsContent>
                    <TabsContent value="academic" className="m-0">
                      <AcademicTab establecimiento={establecimiento} />
                    </TabsContent>
                  </>
                )}
                <TabsContent value="contact" className="m-0">
                  <ContactTab
                    cue={establecimiento.cue}
                    contactos={contactos}
                    distrito={establecimiento.distrito}
                    fedACargo={establecimiento.fed_a_cargo}
                  />
                </TabsContent>
                <TabsContent value="observations" className="m-0">
                  <ObservationsTab establecimiento={establecimiento} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">¿Eliminar Establecimiento?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Estás por eliminar permanentemente el siguiente establecimiento:</p>
              <p className="font-semibold text-foreground">
                {establecimiento.nombre} (CUE: {establecimiento.cue})
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
    </div>
  )
}
