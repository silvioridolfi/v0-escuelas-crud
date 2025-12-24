"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Mail, Phone, User, Building } from "lucide-react"
import { useRouter } from "next/navigation"
import { getFedBadgeColor, getNivelBadgeColor, formatFedDisplay } from "@/lib/badge-colors"

type SearchResult = {
  id: string
  // Establishment fields
  cue?: number
  predio?: number
  nombre: string
  distrito: string
  ciudad: string
  direccion: string
  nivel?: string
  modalidad?: string
  matricula?: number
  fed_a_cargo?: string
  es_establecimiento_educativo?: boolean
  // Organismo fields
  codigo?: string
  tipo_organizacion?: string
  subtipo_organizacion?: string // Added subtipo field
  telefono?: string
  email?: string
  contacto_nombre?: string
  contacto_apellido?: string
  contacto_cargo?: string
  // Contact info
  contactos?: Array<{
    nombre: string
    apellido: string
    telefono: string
    correo: string
  }>
  // Type discriminator
  entity_type: "establecimiento" | "organismo"
}

export function SearchResults({ results, isSearching }: { results: SearchResult[]; isSearching: boolean }) {
  const router = useRouter()

  if (isSearching) {
    return (
      <Card className="border border-slate-200/60 shadow-md bg-white">
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#00AEC3]" />
            <p className="text-slate-600">Buscando establecimientos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="border border-slate-200/60 shadow-md bg-white">
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-700">No se encontraron establecimientos</p>
            <p className="mt-1 text-sm text-slate-500">Intenta con otros términos de búsqueda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-1 w-1 rounded-full bg-[#00AEC3]" />
        <p className="text-sm font-medium text-slate-700">
          {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => {
          const isOrganismo = result.entity_type === "organismo"
          const primaryContact = result.contactos?.[0]
          const isGovernmentBuilding = result.es_establecimiento_educativo === false
          const isRegional = result.subtipo_organizacion === "Jefatura Regional"
          const isDistrital = result.subtipo_organizacion === "Jefatura Distrital"

          return (
            <Card
              key={result.id}
              className="relative overflow-hidden border border-slate-200/60 bg-white shadow-sm hover:shadow-lg transition-all hover:border-[#00AEC3]/30 flex flex-col h-full rounded-xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e81f76] via-[#00AEC3] to-[#417099]" />

              <CardHeader className="pb-3 pt-5 flex-shrink-0">
                <CardTitle className="text-base leading-tight text-balance text-slate-800 min-h-[3rem]">
                  {result.nombre}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {isOrganismo ? (
                    <>
                      <Badge className="bg-slate-700 text-white hover:bg-slate-700/90 font-mono text-xs uppercase">
                        {result.codigo}
                      </Badge>
                      <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs">
                        {result.tipo_organizacion}
                      </Badge>
                      {isRegional && (
                        <Badge className="bg-purple-600 text-white hover:bg-purple-600/90 text-xs">
                          <Building className="h-3 w-3 mr-1" />
                          Jefatura Regional
                        </Badge>
                      )}
                      {isDistrital && (
                        <Badge className="bg-indigo-600 text-white hover:bg-indigo-600/90 text-xs">
                          <Building className="h-3 w-3 mr-1" />
                          Jefatura Distrital
                        </Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <Badge className="bg-[#417099] text-white hover:bg-[#417099]/90 font-mono text-xs">
                        CUE {result.cue}
                      </Badge>
                      <Badge variant="outline" className="border-slate-300 text-slate-600 font-mono text-xs">
                        PREDIO {result.predio}
                      </Badge>
                      {result.nivel && (
                        <Badge className={`${getNivelBadgeColor(result.nivel)} border text-xs`}>{result.nivel}</Badge>
                      )}
                      {result.fed_a_cargo && (
                        <Badge className={`${getFedBadgeColor(result.fed_a_cargo)} border text-xs`}>
                          {formatFedDisplay(result.fed_a_cargo)}
                        </Badge>
                      )}
                      {isGovernmentBuilding && (
                        <Badge className="bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs">
                          Edificio Gubernamental
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00AEC3]" />
                      <div className="text-slate-700 leading-snug">
                        <div className="font-medium">{result.distrito}</div>
                        <div className="text-xs text-slate-600">{result.ciudad}</div>
                        {result.direccion && <div className="text-xs text-slate-600 mt-0.5">{result.direccion}</div>}
                      </div>
                    </div>
                  </div>

                  {isOrganismo ? (
                    <div className="space-y-1.5 pt-1 border-t border-slate-200">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Contacto</div>
                      {(result.contacto_nombre || result.contacto_apellido) && (
                        <div className="flex items-start gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#417099] mt-0.5 shrink-0" />
                          <div>
                            <div className="text-sm text-slate-700 font-medium">
                              {result.contacto_nombre} {result.contacto_apellido}
                              {result.contacto_cargo && (
                                <span className="text-xs text-slate-500 font-normal ml-1">
                                  ({result.contacto_cargo})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {result.telefono && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Phone className="h-3 w-3" />
                          {result.telefono}
                        </div>
                      )}
                      {result.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Mail className="h-3 w-3" />
                          {result.email}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {primaryContact && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-200">
                          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Contacto</div>
                          <div className="flex items-start gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#417099] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-sm text-slate-700 font-medium">
                                {primaryContact.nombre} {primaryContact.apellido}
                              </div>
                            </div>
                          </div>
                          {primaryContact.telefono && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone className="h-3 w-3" />
                              {primaryContact.telefono}
                            </div>
                          )}
                          {primaryContact.correo && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Mail className="h-3 w-3" />
                              {primaryContact.correo}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-3">
                  <Button
                    onClick={() => {
                      const route = isOrganismo ? `/organismos/${result.id}` : `/establecimientos/${result.id}`
                      router.push(route)
                    }}
                    className="w-full bg-gradient-to-r from-[#00AEC3] to-[#417099] hover:from-[#00AEC3]/90 hover:to-[#417099]/90 text-white shadow-sm"
                    size="sm"
                  >
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
