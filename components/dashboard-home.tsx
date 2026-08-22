"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Building2, MapPin, Users, Plus, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { searchEstablecimientos, getAllOrganismos, type SearchResult } from "@/app/actions/search"
import { SearchResults } from "@/components/search-results"
import { useRouter } from "next/navigation"
import { getFedBadgeColor, formatFedDisplay } from "@/lib/badge-colors"

type FedBreakdownItem = { fed: string; count: number }
type DistritoBreakdownItem = { distrito: string; count: number }
type MatriculaByGender = { varones: number; mujeres: number }

type Metrics = {
  totalEstablecimientos: number
  uniqueDistritos: number
  matriculaTotal: number
  totalOrganismos: number // Added organismos to metrics type
  fedBreakdown: FedBreakdownItem[]
  distritoBreakdown: DistritoBreakdownItem[]
  matriculaByGender: MatriculaByGender
}

type MetricDialog = "fed" | "organismos" | "distritos" | "matricula" | null

export function DashboardHome({ metrics }: { metrics: Metrics }) {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  const [openDialog, setOpenDialog] = useState<MetricDialog>(null)
  const [organismos, setOrganismos] = useState<SearchResult[]>([])
  const [isLoadingOrganismos, setIsLoadingOrganismos] = useState(false)

  const handleOpenOrganismos = async () => {
    setOpenDialog("organismos")
    if (organismos.length > 0) return
    setIsLoadingOrganismos(true)
    try {
      const data = await getAllOrganismos()
      setOrganismos(data)
    } catch (error) {
      console.error("Error loading organismos:", error)
    } finally {
      setIsLoadingOrganismos(false)
    }
  }

  const matriculaGenderTotal = metrics.matriculaByGender.varones + metrics.matriculaByGender.mujeres
  const varonesPct = matriculaGenderTotal > 0 ? (metrics.matriculaByGender.varones / matriculaGenderTotal) * 100 : 0
  const mujeresPct = matriculaGenderTotal > 0 ? (metrics.matriculaByGender.mujeres / matriculaGenderTotal) * 100 : 0

  useEffect(() => {
    setMounted(true)

    const savedSearchTerm = sessionStorage.getItem("searchTerm")
    const savedResults = sessionStorage.getItem("searchResults")
    const savedHasSearched = sessionStorage.getItem("hasSearched")

    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm)
    }
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults))
      } catch (error) {
        console.error("Error parsing saved results:", error)
      }
    }
    if (savedHasSearched === "true") {
      setHasSearched(true)
    }
  }, [])

  useEffect(() => {
    // Enfocar automáticamente el buscador al cargar la página para que el
    // usuario pueda escribir de inmediato sin hacer clic.
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (searchTerm) {
      sessionStorage.setItem("searchTerm", searchTerm)
    } else {
      sessionStorage.removeItem("searchTerm")
    }
  }, [searchTerm, mounted])

  useEffect(() => {
    if (!mounted) return

    if (results.length > 0) {
      sessionStorage.setItem("searchResults", JSON.stringify(results))
    } else {
      sessionStorage.removeItem("searchResults")
    }
  }, [results, mounted])

  useEffect(() => {
    if (!mounted) return

    if (hasSearched) {
      sessionStorage.setItem("hasSearched", "true")
    } else {
      sessionStorage.removeItem("hasSearched")
    }
  }, [hasSearched, mounted])

  const handleSearch = async (term?: string) => {
    const searchValue = term !== undefined ? term : searchTerm
    if (!searchValue.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    try {
      const data = await searchEstablecimientos(searchValue.trim())
      setResults(data)
    } catch (error) {
      console.error("Error searching:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (value.trim()) {
      const timeout = setTimeout(() => {
        handleSearch(value)
      }, 1000)
      setDebounceTimeout(timeout)
    } else {
      setHasSearched(false)
      setResults([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setResults([])
    setHasSearched(false)
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    if (mounted) {
      sessionStorage.removeItem("searchTerm")
      sessionStorage.removeItem("searchResults")
      sessionStorage.removeItem("hasSearched")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-md sm:h-12 sm:w-12">
                <Building2 className="h-6 w-6 text-[#417099] sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white text-balance sm:text-2xl">
                  Buscador de Establecimientos Educativos
                </h1>
                <p className="text-sm text-white/90">Región 1</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/establecimientos/nuevo")}
              className="w-full bg-[#e81f76] hover:bg-[#c71963] text-white shadow-lg sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Establecimiento
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex flex-1 flex-col gap-8 px-4 py-6 sm:py-8">
        <section className="order-3 lg:order-1">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#417099]">Métricas Generales</h2>
            <p className="text-sm text-slate-600">Resumen estadístico del sistema</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              role="button"
              tabIndex={0}
              onClick={() => setOpenDialog("fed")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setOpenDialog("fed")
                }
              }}
              className="group relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC3]"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AEC3] to-[#417099]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00AEC3]/10">
                      <Building2 className="h-4 w-4 text-[#00AEC3]" />
                    </div>
                    Total Establecimientos
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00AEC3]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#417099]">
                  {metrics.totalEstablecimientos.toLocaleString("es-AR")}
                </p>
                <p className="mt-1 text-xs text-slate-400">Ver distribución por FED</p>
              </CardContent>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={handleOpenOrganismos}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleOpenOrganismos()
                }
              }}
              className="group relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1]/10">
                      <Building2 className="h-4 w-4 text-[#6366f1]" />
                    </div>
                    Organismos Descentralizados
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#6366f1]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#6366f1]">{metrics.totalOrganismos.toLocaleString("es-AR")}</p>
                <p className="mt-1 text-xs text-slate-400">Ver listado completo</p>
              </CardContent>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => setOpenDialog("distritos")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setOpenDialog("distritos")
                }
              }}
              className="group relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#417099]"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#417099] to-[#00AEC3]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#417099]/10">
                      <MapPin className="h-4 w-4 text-[#417099]" />
                    </div>
                    Distritos
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#417099]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#00AEC3]">{metrics.uniqueDistritos}</p>
                <p className="mt-1 text-xs text-slate-400">Ver establecimientos por distrito</p>
              </CardContent>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => setOpenDialog("matricula")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setOpenDialog("matricula")
                }
              }}
              className="group relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e81f76]"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e81f76] to-[#417099]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e81f76]/10">
                      <Users className="h-4 w-4 text-[#e81f76]" />
                    </div>
                    Matrícula Total
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#e81f76]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#e81f76]">{metrics.matriculaTotal.toLocaleString("es-AR")}</p>
                <p className="mt-1 text-xs text-slate-400">Ver por género</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#417099]">Buscador de establecimientos</h2>
            <p className="text-sm text-slate-600">Busca por CUE, PREDIO, tipo de escuela, o nombre</p>
          </div>
          <Card className="relative overflow-hidden border border-slate-200/60 shadow-lg bg-white">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AEC3] to-[#e81f76]" />
            <CardContent className="pt-6 pb-6 bg-slate-50/50">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    ref={searchInputRef}
                    autoFocus
                    type="text"
                    placeholder="Buscar por CUE, PREDIO, nombre..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="pl-10 text-base border-slate-300 bg-white shadow-sm"
                    disabled={isSearching}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSearch()}
                    disabled={isSearching || !searchTerm.trim()}
                    className="flex-1 bg-[#00AEC3] hover:bg-[#0098ad] text-white shadow-md hover:shadow-lg transition-shadow sm:flex-none"
                  >
                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                  {searchTerm && (
                    <Button
                      onClick={handleClearSearch}
                      variant="outline"
                      className="flex-1 border-slate-300 hover:bg-slate-100 shadow-sm bg-transparent sm:flex-none"
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {hasSearched && (
          <section className="order-2 lg:order-3">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#417099]">Resultados</h2>
              <p className="text-sm text-slate-600">Establecimientos encontrados</p>
            </div>
            <SearchResults results={results} isSearching={isSearching} />
          </section>
        )}

        {!hasSearched && (
          <section className="order-2 lg:order-3">
            <Card className="relative overflow-hidden border-2 border-dashed border-slate-300/60 shadow-sm bg-slate-50/30">
              <CardContent className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100/50 border border-slate-200">
                    <Search className="h-10 w-10 text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">Buscar establecimientos</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Ingresa un término de búsqueda para encontrar establecimientos
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      <Dialog open={openDialog === "fed"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#417099]">Establecimientos por FED</DialogTitle>
            <DialogDescription>Cantidad de establecimientos asignados a cada FED</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {metrics.fedBreakdown.map((item) => (
              <div
                key={item.fed}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2.5"
              >
                <Badge className={`${getFedBadgeColor(item.fed)} min-w-0 justify-self-start border text-left text-xs whitespace-normal`}>
                  {formatFedDisplay(item.fed)}
                </Badge>
                <span className="whitespace-nowrap text-right text-sm font-semibold text-slate-700">
                  {item.count.toLocaleString("es-AR")} {item.count === 1 ? "escuela" : "escuelas"}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "organismos"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-[#6366f1]">Organismos Descentralizados</DialogTitle>
            <DialogDescription>Listado completo de organismos descentralizados</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            {isLoadingOrganismos ? (
              <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
                Cargando organismos…
              </div>
            ) : (
              <SearchResults results={organismos} isSearching={false} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "distritos"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#00AEC3]">Establecimientos por Distrito</DialogTitle>
            <DialogDescription>Cantidad de establecimientos en cada distrito</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {metrics.distritoBreakdown.map((item) => (
              <div
                key={item.distrito}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2"
              >
                <span className="text-sm font-medium text-slate-700">{item.distrito}</span>
                <span className="text-sm font-semibold text-[#417099]">
                  {item.count.toLocaleString("es-AR")} {item.count === 1 ? "establecimiento" : "establecimientos"}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "matricula"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#e81f76]">Matrícula por Género</DialogTitle>
            <DialogDescription>Distribución de la matrícula total por género</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Varones</span>
                <span className="text-lg font-bold text-[#417099]">
                  {metrics.matriculaByGender.varones.toLocaleString("es-AR")}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-[#417099]" style={{ width: `${varonesPct}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-400">{varonesPct.toFixed(1)}% del total</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Mujeres</span>
                <span className="text-lg font-bold text-[#e81f76]">
                  {metrics.matriculaByGender.mujeres.toLocaleString("es-AR")}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-[#e81f76]" style={{ width: `${mujeresPct}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-400">{mujeresPct.toFixed(1)}% del total</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm font-semibold text-slate-600">Total</span>
              <span className="text-sm font-bold text-slate-800">
                {matriculaGenderTotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
