"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { ConnectivityTab } from "@/components/tabs/connectivity-tab"
import { AcademicTab } from "@/components/tabs/academic-tab"
import { ObservationsTab } from "@/components/tabs/observations-tab"
import { ContactTab } from "@/components/tabs/contact-tab"
import { LocationTab } from "@/components/tabs/location-tab"
import { HistorialTab } from "@/components/tabs/historial-tab"
import { splitEstablishmentName } from "@/lib/school-name"
import { deleteEstablishment } from "@/app/actions/delete-establishment"
import type { Establecimiento } from "@/lib/establecimiento"
import { EstablishmentHero } from "@/components/establishment-hero"

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

type SharedPredioSibling = { id: string; cue: number; nombre: string }

function SectionTitle({
  icon: Icon,
  label,
  color,
  bgColor,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  bgColor: string
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgColor}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{label}</h3>
    </div>
  )
}

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isGovernmentBuilding = establecimiento.es_establecimiento_educativo === false
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
            <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
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
        <Card
          className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
            establecimiento.tipo_establecimiento === "Escuela cerrada" ||
            establecimiento.tipo_establecimiento === "Contexto de encierro"
              ? "border-red-200"
              : "border-slate-200"
          }`}
        >
          <div
            className={`h-1 ${
              establecimiento.tipo_establecimiento === "Escuela cerrada" ||
              establecimiento.tipo_establecimiento === "Contexto de encierro"
                ? "bg-red-500"
                : "bg-gradient-to-r from-[#e81f76] via-[#00AEC3] to-[#417099]"
            }`}
          />

          <CardContent className="p-5 sm:p-6">
            <EstablishmentHero
              establecimiento={establecimiento}
              isGovernmentBuilding={isGovernmentBuilding}
              contactoPrimario={contactos[0] || null}
              sharedPredio={sharedPredio}
            />

            <div className="mt-8 border-t border-slate-200 pt-6">
              <SectionTitle icon={FileText} label="Datos generales" color="text-[#417099]" bgColor="bg-[#417099]/10" />
              <GeneralTab establecimiento={establecimiento} isGovernmentBuilding={isGovernmentBuilding} />
            </div>

            {!isGovernmentBuilding && (
              <>
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <SectionTitle icon={GraduationCap} label="Académico" color="text-[#e81f76]" bgColor="bg-[#e81f76]/10" />
                  <AcademicTab establecimiento={establecimiento} />
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <SectionTitle icon={Wifi} label="Conectividad" color="text-[#00AEC3]" bgColor="bg-[#00AEC3]/10" />
                  <ConnectivityTab establecimiento={establecimiento} />
                </div>
              </>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6">
              <SectionTitle icon={Users} label="Contacto" color="text-[#417099]" bgColor="bg-[#417099]/10" />
              <ContactTab
                cue={establecimiento.cue}
                contactos={contactos}
                distrito={establecimiento.distrito}
                fedACargo={establecimiento.fed_a_cargo}
              />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <SectionTitle icon={MapPin} label="Ubicación" color="text-emerald-600" bgColor="bg-emerald-50" />
              <LocationTab establecimiento={establecimiento} />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <SectionTitle icon={FileWarning} label="Observaciones" color="text-amber-600" bgColor="bg-amber-50" />
              <ObservationsTab establecimiento={establecimiento} />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <SectionTitle icon={History} label="Historial" color="text-violet-600" bgColor="bg-violet-50" />
              <HistorialTab establecimientoId={establecimiento.id} />
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
