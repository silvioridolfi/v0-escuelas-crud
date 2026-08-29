"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
import { ArrowLeft, FileText, Wifi, GraduationCap, Users, FileWarning, Trash2, MapPin, History } from "lucide-react"
import { useRouter } from "next/navigation"
import { GeneralTab } from "@/components/tabs/general-tab"
import { ConnectivitySection } from "@/components/tabs/connectivity-section"
import { AcademicSection } from "@/components/tabs/academic-section"
import { ObservationsTab } from "@/components/tabs/observations-tab"
import { ContactSection } from "@/components/tabs/contact-section"
import { LocationTab } from "@/components/tabs/location-tab"
import { HistorialTab } from "@/components/tabs/historial-tab"
import { splitEstablishmentName } from "@/lib/school-name"
import { deleteEstablishment } from "@/app/actions/delete-establishment"
import type { Establecimiento } from "@/lib/establecimiento"
import { EstablishmentHero } from "@/components/establishment-hero"
import { ThemeToggle } from "@/components/theme-toggle"

type Contacto = {
  id: string
  cue: number
  nombre: string | null
  apellido: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
  correo_laboral: string | null
  distrito: string | null
  fed_a_cargo: string | null
  es_principal?: boolean
}

type SharedPredioSibling = { id: string; cue: number; nombre: string }

export function EstablishmentEditor({
  establecimiento,
  contactos,
  sharedPredio = [],
}: {
  establecimiento: Establecimiento
  contactos: Contacto[]
  sharedPredio?: SharedPredioSibling[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isGovernmentBuilding = establecimiento.es_establecimiento_educativo === false
  const isClosedOrContext =
    establecimiento.tipo_establecimiento === "Escuela cerrada" || establecimiento.tipo_establecimiento === "Contexto de encierro"
  const { primary: nombrePrimary, secondary: nombreSecondary } = splitEstablishmentName(establecimiento.nombre)

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
    { value: "general", label: "General", icon: FileText, color: "text-[#417099]", bgColor: "bg-[#417099]/10", showForGovBuilding: true },
    { value: "connectivity", label: "Conectividad", icon: Wifi, color: "text-[#00AEC3]", bgColor: "bg-[#00AEC3]/10", showForGovBuilding: false },
    { value: "academic", label: "Académico", icon: GraduationCap, color: "text-[#e81f76]", bgColor: "bg-[#e81f76]/10", showForGovBuilding: false },
    { value: "contact", label: "Contacto", icon: Users, color: "text-[#417099]", bgColor: "bg-[#417099]/10", showForGovBuilding: true },
    { value: "location", label: "Ubicación", icon: MapPin, color: "text-emerald-600", bgColor: "bg-emerald-50", showForGovBuilding: true },
    { value: "observations", label: "Observaciones", icon: FileWarning, color: "text-amber-600", bgColor: "bg-amber-50", showForGovBuilding: true },
    { value: "historial", label: "Historial", icon: History, color: "text-violet-600", bgColor: "bg-violet-50", showForGovBuilding: true },
  ]

  const tabsConfig = isGovernmentBuilding ? allTabsConfig.filter((tab) => tab.showForGovBuilding) : allTabsConfig

  const tabNav = (
    <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
      {tabsConfig.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs font-medium transition-all active:scale-95 ${
              isActive ? `${tab.color} ${tab.bgColor}` : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                size="icon"
                className="shrink-0 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-bold leading-tight text-white text-balance sm:text-2xl">
                  <span className="block">{nombrePrimary}</span>
                  {nombreSecondary && (
                    <span className="mt-0.5 block text-base font-medium text-white/90 sm:text-lg">
                      {nombreSecondary}
                    </span>
                  )}
                </h1>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
              <ThemeToggle />
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="w-full bg-red-600 text-white hover:bg-red-700 shadow-md sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Establecimiento
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Card className={`overflow-hidden rounded-xl border bg-white dark:bg-white/10 dark:backdrop-blur-sm shadow-sm dark:shadow-lg ${isClosedOrContext ? "border-red-200 dark:border-red-500/30" : "border-slate-200 dark:border-white/10"}`}>
          <div className={`h-1 ${isClosedOrContext ? "bg-red-500" : "bg-gradient-to-r from-[#e81f76] via-[#00AEC3] to-[#417099]"}`} />

          <CardContent className="p-5 sm:p-6">
            <EstablishmentHero establecimiento={establecimiento} centerSlot={tabNav} />

            <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="general" className="m-0">
                  <GeneralTab establecimiento={establecimiento} isGovernmentBuilding={isGovernmentBuilding} />
                </TabsContent>
                {!isGovernmentBuilding && (
                  <>
                    <TabsContent value="connectivity" className="m-0">
                      <ConnectivitySection establecimiento={establecimiento} sharedPredio={sharedPredio} />
                    </TabsContent>
                    <TabsContent value="academic" className="m-0">
                      <AcademicSection establecimiento={establecimiento} />
                    </TabsContent>
                  </>
                )}
                <TabsContent value="contact" className="m-0">
                  <ContactSection
                    cue={establecimiento.cue}
                    contactos={contactos}
                    distrito={establecimiento.distrito}
                    fedACargo={establecimiento.fed_a_cargo}
                  />
                </TabsContent>
                <TabsContent value="location" className="m-0">
                  <LocationTab establecimiento={establecimiento} />
                </TabsContent>
                <TabsContent value="observations" className="m-0">
                  <ObservationsTab establecimiento={establecimiento} />
                </TabsContent>
                <TabsContent value="historial" className="m-0">
                  <HistorialTab establecimientoId={establecimiento.id} />
                </TabsContent>
              </Tabs>
            </div>
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
