"use client"

import { useState, useMemo } from "react"
import { Search, Building2, MapPin, Users, Wifi, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SchoolDetailsDialog } from "@/components/school-details-dialog"

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
  fed_a_cargo: string
  plan_enlace: string
  lat: number
  lon: number
  [key: string]: unknown
}

interface SchoolEditorProps {
  initialData: Establecimiento[]
}

export function SchoolEditor({ initialData }: SchoolEditorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState<Establecimiento | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredSchools = useMemo(() => {
    if (!searchTerm.trim()) return initialData

    const search = searchTerm.toLowerCase()
    return initialData.filter(
      (school) =>
        school.nombre?.toLowerCase().includes(search) ||
        school.cue?.toString().includes(search) ||
        school.distrito?.toLowerCase().includes(search) ||
        school.ciudad?.toLowerCase().includes(search),
    )
  }, [searchTerm, initialData])

  const handleEditSchool = (school: Establecimiento) => {
    setSelectedSchool(school)
    setDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-foreground">Editor de Establecimientos Educativos</h1>
              <p className="text-sm text-muted-foreground">Provincia de Buenos Aires</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 px-4 py-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, CUE, distrito o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredSchools.length} establecimiento{filteredSchools.length !== 1 ? "s" : ""} encontrado
                {filteredSchools.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Schools List */}
        <div className="grid gap-4">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg text-balance">{school.nombre}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">CUE: {school.cue}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{school.fed_a_cargo}</span>
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleEditSchool(school)} variant="outline" size="sm">
                    Editar
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {school.direccion}, {school.ciudad} - {school.distrito}
                  </span>
                </div>

                {/* Education Info */}
                <div className="flex flex-wrap gap-2">
                  {school.nivel && (
                    <Badge variant="secondary" className="font-normal">
                      {school.nivel}
                    </Badge>
                  )}
                  {school.modalidad && (
                    <Badge variant="outline" className="font-normal">
                      {school.modalidad}
                    </Badge>
                  )}
                  {school.tipo_establecimiento && (
                    <Badge variant="outline" className="font-normal">
                      {school.tipo_establecimiento}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {school.matricula > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        <span className="font-medium">{school.matricula}</span> estudiantes
                      </span>
                    </div>
                  )}
                  {school.plan_enlace && (
                    <div className="flex items-center gap-1.5">
                      <Wifi className="h-4 w-4 text-accent" />
                      <span className="text-foreground">{school.plan_enlace}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSchools.length === 0 && (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-lg font-medium text-foreground">No se encontraron establecimientos</p>
                  <p className="mt-1 text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <SchoolDetailsDialog school={selectedSchool} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
