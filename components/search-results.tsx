"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, MapPin, Mail, Phone, User, Building, AlertTriangle, Wifi, Network, GraduationCap, Users, Calendar, Layers, FileSpreadsheet } from "lucide-react"
import { useRouter } from "next/navigation"
import { getFedBadgeColor, formatFedDisplay, formatTurno, parsePlanTokens, getPlanTokenBadgeColor } from "@/lib/badge-colors"
import { splitEstablishmentName } from "@/lib/school-name"
import type { SearchResult } from "@/app/actions/search"

// Arma un .xlsx con los resultados actuales de la búsqueda/filtro y dispara
// la descarga en el navegador. Import dinámico: xlsx es una librería
// pesada, no tiene sentido incluirla en el bundle inicial de la página.
async function exportResultsToExcel(results: SearchResult[]) {
  if (results.length === 0) return

  const XLSX = await import("xlsx")

  const rows = results.map((r) => {
    const isOrganismo = r.entity_type === "organismo"
    const contacto = r.contactos?.[0]
    return {
      Tipo: isOrganismo ? "Organismo" : r.es_establecimiento_educativo === false ? "Nivel Central" : "Establecimiento",
      "CUE / Código": isOrganismo ? r.codigo : r.cue,
      Nombre: r.nombre,
      Distrito: r.distrito,
      Ciudad: r.ciudad,
      Dirección: r.direccion || "",
      Nivel: r.nivel || "",
      Modalidad: r.modalidad || "",
      Turno: formatTurno(r.turnos) || "",
      Matrícula: r.matricula ?? "",
      Secciones: r.secciones ?? "",
      Predio: r.predio ?? "",
      "FED a cargo": r.fed_a_cargo || "",
      Estado:
        r.tipo_establecimiento === "Escuela cerrada" || r.tipo_establecimiento === "Contexto de encierro"
          ? r.tipo_establecimiento
          : "Activa",
      "Contacto (nombre)": contacto ? [contacto.nombre, contacto.apellido].filter(Boolean).join(" ") : "",
      "Contacto (cargo)": contacto?.cargo || "",
      "Contacto (teléfono)": contacto?.telefono || "",
      "Contacto (correo institucional)": contacto?.correo || "",
      "Contacto (correo laboral)": contacto?.correo_laboral || "",
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados")

  const fecha = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `establecimientos_${fecha}.xlsx`)
}

const LocationMap = dynamic(() => import("@/components/tabs/location-map").then((mod) => mod.LocationMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-white/10 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
})

function StatTileCompact({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
  iconColor: string
  iconBg: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:border-white/10 dark:bg-white/5 p-2 ${className}`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wide text-slate-400 dark:text-gray-400">{label}</p>
        <p className="break-words text-sm font-semibold leading-tight text-slate-800 dark:text-white">
          {value === null || value === undefined || value === "" ? "—" : value}
        </p>
      </div>
    </div>
  )
}

export function SearchResults({ results, isSearching }: { results: SearchResult[]; isSearching: boolean }) {
  const router = useRouter()
  const [mapResultId, setMapResultId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(30)
  const mapResult = results.find((r) => r.id === mapResultId) || null
  const hasMapCoordinates = (r: SearchResult | null) =>
    !!r && typeof r.lat === "number" && typeof r.lon === "number" && !Number.isNaN(r.lat) && !Number.isNaN(r.lon)

  // Si cambia la búsqueda (resultados nuevos), volver a mostrar solo los
  // primeros 30 en vez de arrastrar el límite expandido de la búsqueda anterior.
  useEffect(() => {
    setVisibleCount(30)
  }, [results])

  if (isSearching) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-pulse rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 h-4 w-20 rounded-full bg-slate-100 dark:bg-white/10" />
            <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 dark:bg-white/20" />
            <div className="mb-4 h-4 w-1/2 rounded bg-slate-100 dark:bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-100 dark:bg-white/10" />
              <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="rounded-xl border border-slate-200/60 shadow-sm bg-white dark:border-white/10 dark:shadow-lg dark:bg-white/10 dark:backdrop-blur-sm">
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20">
              <Building2 className="h-8 w-8 text-slate-400 dark:text-gray-400" />
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-gray-100">No se encontraron establecimientos</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-300">Intenta con otros términos de búsqueda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-[#00AEC3]" />
          <p className="text-sm font-medium text-slate-700 dark:text-gray-100">
            {results.length > visibleCount
              ? `${visibleCount} de ${results.length} resultados`
              : `${results.length} resultado${results.length !== 1 ? "s" : ""} encontrado${results.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={() => exportResultsToExcel(results)}
          variant="outline"
          size="sm"
          className="gap-1.5 border-slate-300 dark:border-white/20 text-slate-700 dark:text-gray-100 hover:border-[#00AEC3]/50 hover:text-[#00AEC3]"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Exportar a Excel
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.slice(0, visibleCount).map((result, index) => {
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
              className="relative overflow-hidden border border-slate-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-sm dark:shadow-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#00AEC3]/30 flex flex-col h-full rounded-xl animate-in fade-in slide-in-from-bottom-1 duration-300"
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
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        isOrganismo
                          ? "bg-indigo-500/10 border-indigo-500/20"
                          : isGovernmentBuilding
                            ? "bg-amber-500/10 border-amber-500/20"
                            : "bg-teal-500/10 border-teal-500/20"
                      }`}
                    >
                      {isOrganismo ? (
                        <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Building2 className={`h-4 w-4 ${isGovernmentBuilding ? "text-amber-600 dark:text-amber-400" : "text-teal-600 dark:text-teal-400"}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">
                        {isOrganismo ? "Código" : isGovernmentBuilding ? "Nivel Central" : "CUE"}
                      </p>
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                        {isOrganismo ? result.codigo : result.cue}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                      isClosedOrContext
                        ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    <span className={`h-1 w-1 rounded-full ${isClosedOrContext ? "bg-red-500" : "bg-emerald-500"}`} />
                    {isClosedOrContext ? "" : "ACTIVA"}
                    {isClosedOrContext && <AlertTriangle className="h-2.5 w-2.5" />}
                    {isClosedOrContext && result.tipo_establecimiento}
                  </span>
                </div>

                <CardTitle className="text-base leading-tight text-balance text-slate-800 dark:text-white min-h-[3rem]">
                  <span className="block">{nombrePrimary}</span>
                  {nombreSecondary && (
                    <span className="mt-0.5 block text-sm font-normal text-slate-600 dark:text-gray-200">{nombreSecondary}</span>
                  )}
                </CardTitle>

                <div className="flex flex-wrap gap-2 mt-2">
                  {isOrganismo ? (
                    <>
                      <Badge variant="outline" className="border-slate-300 dark:border-white/20 text-slate-700 dark:text-gray-100 text-xs">
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
                        <Badge variant="outline" className="border-slate-300 dark:border-white/20 text-slate-600 dark:text-gray-200 font-mono text-xs">
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
                          <Network className="h-3 w-3 mr-1" />
                          {token}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </CardHeader>

              {result.sharedWith && result.sharedWith.length > 0 && (
                <div className="mx-4 mb-1 rounded-md border border-amber-400/40 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 px-2.5 py-2">
                  <div className="mb-1.5 flex items-start gap-1.5 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
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
                        <span className="mt-0.5 block text-[10px] text-amber-700 dark:text-amber-400">CUE {sibling.cue}</span>
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
                      <div className="text-slate-700 dark:text-gray-100 leading-snug">
                        <div className="font-medium">{result.distrito}</div>
                        <div className="text-xs text-slate-600 dark:text-gray-200">{result.ciudad}</div>
                        {result.direccion && <div className="text-xs text-slate-600 dark:text-gray-200 mt-0.5">{result.direccion}</div>}
                      </div>
                    </div>
                  </div>

                  {!isOrganismo && !isGovernmentBuilding && (
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-white/10 pt-2.5">
                      <StatTileCompact icon={Users} label="Nivel" value={result.nivel} iconColor="text-teal-600 dark:text-teal-400" iconBg="bg-teal-500/10 border border-teal-500/20" />
                      <StatTileCompact
                        icon={GraduationCap}
                        label="Modalidad"
                        value={result.modalidad}
                        iconColor="text-indigo-600 dark:text-indigo-400"
                        iconBg="bg-indigo-500/10 border border-indigo-500/20"
                      />
                      <StatTileCompact
                        icon={User}
                        label="Matrícula"
                        value={
                          result.matricula !== null && result.matricula !== undefined
                            ? result.matricula.toLocaleString("es-AR")
                            : null
                        }
                        iconColor="text-[#e81f76]"
                        iconBg="bg-[#e81f76]/10 border border-[#e81f76]/25"
                      />
                      <StatTileCompact icon={Layers} label="Secciones" value={result.secciones} iconColor="text-violet-600 dark:text-violet-400" iconBg="bg-violet-500/10 border border-violet-500/20" />
                      <StatTileCompact
                        icon={Calendar}
                        label="Turno"
                        value={formatTurno(result.turnos)}
                        iconColor="text-[#417099]"
                        iconBg="bg-[#417099]/10 border border-[#417099]/25"
                        className="col-span-2"
                      />
                    </div>
                  )}

                  {isOrganismo ? (
                    <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-white/20">
                      <div className="text-xs font-medium text-slate-500 dark:text-gray-300 uppercase tracking-wide">Contacto</div>
                      {(result.contacto_nombre || result.contacto_apellido) && (
                        <div className="flex items-start gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#417099] mt-0.5 shrink-0" />
                          <div>
                            <div className="text-sm text-slate-700 dark:text-gray-100 font-medium">
                              {result.contacto_nombre} {result.contacto_apellido}
                              {result.contacto_cargo && (
                                <span className="text-xs text-slate-500 dark:text-gray-300 font-normal ml-1">
                                  ({result.contacto_cargo})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {result.telefono && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-gray-200">
                          <Phone className="h-3 w-3" />
                          {result.telefono}
                        </div>
                      )}
                      {result.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-gray-200">
                          <Mail className="h-3 w-3" />
                          {result.email}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {primaryContact &&
                        (primaryContact.nombre || primaryContact.telefono || primaryContact.correo || primaryContact.correo_laboral) && (
                        <div className="border-t border-slate-100 dark:border-white/10 pt-2.5">
                          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-400">
                            Contacto
                          </p>
                          <div className="flex items-start gap-2 rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:border-white/10 dark:bg-white/5 p-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#417099]/10">
                              <User className="h-3.5 w-3.5 text-[#417099]" />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              {(primaryContact.nombre || primaryContact.apellido) && (
                                <p className="truncate text-sm font-semibold leading-tight text-slate-800 dark:text-white">
                                  {[primaryContact.nombre, primaryContact.apellido].filter(Boolean).join(" ")}
                                </p>
                              )}
                              {primaryContact.cargo && (
                                <p className="truncate text-xs text-slate-500 dark:text-gray-300">{primaryContact.cargo}</p>
                              )}
                              {primaryContact.telefono && (
                                <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-gray-200">
                                  <Phone className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{primaryContact.telefono}</span>
                                </p>
                              )}
                              {primaryContact.correo && (
                                <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-gray-200">
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{primaryContact.correo}</span>
                                </p>
                              )}
                              {primaryContact.correo_laboral && (
                                <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-gray-200" title="Correo laboral personal">
                                  <Mail className="h-3 w-3 shrink-0 text-[#00AEC3]" />
                                  <span className="truncate">{primaryContact.correo_laboral}</span>
                                </p>
                              )}
                            </div>
                          </div>
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

      {visibleCount < results.length && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={() => setVisibleCount((v) => v + 30)}
            variant="outline"
            className="border-slate-300 dark:border-white/20 text-slate-700 dark:text-gray-100 hover:border-[#00AEC3]/50 hover:text-[#00AEC3]"
          >
            Mostrar {Math.min(30, results.length - visibleCount)} más ({results.length - visibleCount} restantes)
          </Button>
        </div>
      )}

      <Dialog open={mapResultId !== null} onOpenChange={(open) => !open && setMapResultId(null)}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] p-0 sm:max-w-2xl">
          <DialogHeader className="px-4 pt-4 pb-3 pr-14 text-left border-b border-slate-200 dark:border-white/20">
              <DialogTitle className="text-sm font-semibold text-slate-800 dark:text-white text-balance leading-snug">
                Ubicación: {mapResult?.nombre}
              </DialogTitle>
              <DialogDescription className="sr-only">Mapa de ubicación de {mapResult?.nombre}</DialogDescription>
            {mapResult?.direccion && <p className="text-xs text-slate-500 dark:text-gray-300">{mapResult.direccion}</p>}
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
