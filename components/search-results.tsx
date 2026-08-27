"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, MapPin, Mail, Phone, User, Building, AlertTriangle, Wifi, Server, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { getFedBadgeColor, formatFedDisplay, parsePlanTokens, getPlanTokenBadgeColor } from "@/lib/badge-colors"
import { splitEstablishmentName } from "@/lib/school-name"
import type { SearchResult } from "@/app/actions/search"

const LocationMap = dynamic(() => import("@/components/tabs/location-map").then((mod) => mod.LocationMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
})

export function SearchResults({ results, isSearching }: { results: SearchResult[]; isSearching: boolean }) {
  const router = useRouter()
  const [mapResultId, setMapResultId] = useState<string | null>(null)
  const mapResult = results.find((r) => r.id === mapResultId) || null
  const hasMapCoordinates = (r: SearchResult | null) =>
    !!r && typeof r.lat === "number" && typeof r.lon === "number" && !Number.isNaN(r.lat) && !Number.isNaN(r.lon)

  if (isSearching) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-pulse rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 h-4 w-20 rounded-full bg-slate-100" />
            <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
            <div className="mb-4 h-4 w-1/2 rounded bg-slate-100" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-5/6 rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="rounded-xl border border-slate-200/60 shadow-sm bg-white">
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
        {results.map((result, index) => {
          const isOrganismo = result.entity_type === "organismo"
          const primaryContact = result.contactos?.[0]
          const isGovernmentBuilding = result.es_establecimiento_educativo === false
          const isClosedOrContext =
            result.tipo_establecimiento === "Escuela cerrada" || result.tipo_establecimiento === "Contexto de encierro"
          const isRegional = result.subtipo_organizacion === "Jefatura Regional"
          const isDistrital = result.subtipo_organizacion === "Jefatura Distrital"
          const { primary: nombrePrimary, secondary: nombreSecondary } = splitEstablishmentName(result.nombre)

          return (
            <Card
              key={result.id}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms`, animationFillMode: "backwards" }}
              className="relative overflow-hidden border border-slate-200/60 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#00AEC3]/30 flex flex-col h-full rounded-xl animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isClosedOrContext ? "bg-red-500" : "bg-gradient-to-r from-[#e81f76] via-[#00AEC3] to-[#417099]"
                }`}
              />

              <CardHeader className="pb-3 pt-5 flex-shrink-0">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isOrganismo ? "bg-indigo-50" : isGovernmentBuilding ? "bg-amber-50" : "bg-teal-50"
                      }`}
                    >
                      {isOrganismo ? (
                        <Building className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Building2 className={`h-4 w-4 ${isGovernmentBuilding ? "text-amber-600" : "text-teal-600"}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                        {isOrganismo ? "Código" : isGovernmentBuilding ? "Nivel Central" : "CUE"}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {isOrganismo ? result.codigo : result.cue}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                      isClosedOrContext ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span className={`h-1 w-1 rounded-full ${isClosedOrContext ? "bg-red-500" : "bg-emerald-500"}`} />
                    {isClosedOrContext ? "" : "ACTIVA"}
                    {isClosedOrContext && <AlertTriangle className="h-2.5 w-2.5" />}
                    {isClosedOrContext && result.tipo_establecimiento}
                  </span>
                </div>

                <CardTitle className="text-base leading-tight text-balance text-slate-800 min-h-[3rem]">
                  <span className="block">{nombrePrimary}</span>
                  {nombreSecondary && (
                    <span className="mt-0.5 block text-sm font-normal text-slate-600">{nombreSecondary}</span>
                  )}
                </CardTitle>

                {!isOrganismo && (result.nivel || result.modalidad) && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                    <GraduationCap className="h-3 w-3 shrink-0 text-indigo-500" />
                    <span className="truncate">
                      {[result.nivel, result.modalidad].filter(Boolean).join(" · ")}
                    </span>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {isOrganismo ? (
                    <>
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
                      {!isGovernmentBuilding && result.predio && (
                        <Badge variant="outline" className="border-slate-300 text-slate-600 font-mono text-xs">
                          PREDIO {result.predio}
                        </Badge>
                      )}
                      {result.fed_a_cargo && (
                        <Badge className={`${getFedBadgeColor(result.fed_a_cargo)} border text-xs`}>
                          {formatFedDisplay(result.fed_a_cargo)}
                        </Badge>
                      )}
                      {parsePlanTokens(result.plan_enlace).map((token, i) => (
                        <Badge
                          key={`enlace-${i}`}
                          className={`${getPlanTokenBadgeColor(token)} border text-xs`}
                          title="Tipo de enlace"
                        >
                          <Wifi className="h-3 w-3 mr-1" />
                          {token}
                        </Badge>
                      ))}
                      {parsePlanTokens(result.plan_piso_tecnologico).map((token, i) => (
                        <Badge
                          key={`piso-${i}`}
                          className={`${getPlanTokenBadgeColor(token)} border text-xs`}
                          title="Piso tecnológico"
                        >
                          <Server className="h-3 w-3 mr-1" />
                          {token}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </CardHeader>

              {result.sharedWith && result.sharedWith.length > 0 && (
                <div className="mx-4 mb-1 rounded-md border border-amber-400/40 bg-amber-50 px-2.5 py-2">
                  <div className="mb-1.5 flex items-start gap-1.5 text-amber-800">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span className="text-[11px] font-medium leading-tight">
                      Comparte predio con{" "}
                      {result.sharedWith.length === 1 ? "otro establecimiento" : "otros establecimientos"}:
                    </span>
                  </div>
                  <div className="space-y-1 pl-5">
                    {result.sharedWith.map((sibling) => (
                      <button
                        key={sibling.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/establecimientos/${sibling.id}`)
                        }}
                        className="block w-full rounded border border-amber-300/70 bg-white px-2 py-1 text-left transition-colors hover:border-amber-500 hover:bg-amber-100/60"
                      >
                        <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-amber-900 underline">
                          {sibling.nombre}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-amber-700">CUE {sibling.cue}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

                  {!isOrganismo && !isGovernmentBuilding && (
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e81f76]/10">
                          <User className="h-3.5 w-3.5 text-[#e81f76]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">Matrícula</p>
                          <p className="text-sm font-semibold leading-tight text-slate-800">
                            {result.matricula ? result.matricula.toLocaleString("es-AR") : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50">
                          <Building className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">Secciones</p>
                          <p className="text-sm font-semibold leading-tight text-slate-800">{result.secciones ?? "—"}</p>
                        </div>
                      </div>
                    </div>
                  )}

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

                <div className="pt-3 space-y-2">
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
                  {hasMapCoordinates(result) && (
                    <Button
                      onClick={() => setMapResultId(result.id)}
                      variant="outline"
                      className="w-full border-[#417099]/30 text-[#417099] hover:bg-[#417099]/10 hover:text-[#417099]"
                      size="sm"
                    >
                      <MapPin className="h-4 w-4 mr-1.5" />
                      Ver ubicación
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={mapResultId !== null} onOpenChange={(open) => !open && setMapResultId(null)}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] p-0 sm:max-w-2xl">
          <DialogHeader className="px-4 pt-4 pb-3 pr-14 text-left border-b border-slate-200">
              <DialogTitle className="text-sm font-semibold text-slate-800 text-balance leading-snug">
                Ubicación: {mapResult?.nombre}
              </DialogTitle>
              <DialogDescription className="sr-only">Mapa de ubicación de {mapResult?.nombre}</DialogDescription>
            {mapResult?.direccion && <p className="text-xs text-slate-500">{mapResult.direccion}</p>}
          </DialogHeader>
          {hasMapCoordinates(mapResult) && mapResult && (
            <div className="h-[60vh] max-h-[500px] w-full sm:h-[420px]">
              <LocationMap
                lat={mapResult.lat as number}
                lon={mapResult.lon as number}
                nombre={mapResult.nombre}
                direccion={mapResult.direccion}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
