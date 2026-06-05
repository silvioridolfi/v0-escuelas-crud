"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Building2, MapPin, Users, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchEstablecimientos } from "@/app/actions/search"
import { SearchResults } from "@/components/search-results"
import { useRouter } from "next/navigation"

type Metrics = {
  totalEstablecimientos: number
  uniqueDistritos: number
  matriculaTotal: number
  totalOrganismos: number
}

type SearchResult = {
  id: string
  cue: number
  nombre: string
  distrito: string
  ciudad: string
  nivel: string
  modalidad: string
  matricula: number
}

export function DashboardHome({ metrics }: { metrics: Metrics }) {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const router = useRouter()

  // FIXED: usar useRef en lugar de useState para el timeout del debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)

    const savedSearchTerm = sessionStorage.getItem("searchTerm")
    const savedResults = sessionStorage.getItem("searchResults")
    const savedHasSearched = sessionStorage.getItem("hasSearched")

    if (savedSearchTerm) setSearchTerm(savedSearchTerm)
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults))
      } catch (e) {
        console.error("Error parsing saved results:", e)
      }
    }
    if (savedHasSearched === "true") setHasSearched(true)
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

    // FIXED: limpiar correctamente el timeout anterior con useRef
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        handleSearch(value)
      }, 800)
    } else {
      setHasSearched(false)
      setResults([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchTerm("")
    setResults([])
    setHasSearched(false)
    if (mounted) {
      sessionStorage.removeItem("searchTerm")
      sessionStorage.removeItem("searchResults")
      sessionStorage.removeItem("hasSearched")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header — responsive: stack en mobile */}
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-md sm:h-12 sm:w-12">
                <Building2 className="h-6 w-6 text-[#417099] sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white sm:text-2xl">
                  Editor de Establecimientos
                </h1>
                <p className="text-xs text-white/90 sm:text-sm">DTE · Provincia de Buenos Aires</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/establecimientos/nuevo")}
              className="self-start bg-[#e81f76] hover:bg-[#c71963] text-white shadow-lg sm:self-auto"
              size="sm"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Nueva Entidad
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 px-4 py-6 space-y-6 sm:py-8 sm:space-y-8">
        {/* Métricas */}
        <section>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-[#417099] sm:text-lg">Métricas Generales</h2>
            <p className="text-xs text-slate-600 sm:text-sm">Región 1 — Berisso, Ensenada, Magdalena, Punta Indio, Brandsen</p>
          </div>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AEC3] to-[#417099]" />
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00AEC3]/10">
                    <Building2 className="h-3.5 w-3.5 text-[#00AEC3]" />
                  </div>
                  Establecimientos
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-3xl font-bold text-[#417099] sm:text-4xl">{metrics.totalEstablecimientos.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366f1]/10">
                    <Building2 className="h-3.5 w-3.5 text-[#6366f1]" />
                  </div>
                  Organismos
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-3xl font-bold text-[#6366f1] sm:text-4xl">{metrics.totalOrganismos.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#417099] to-[#00AEC3]" />
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#417099]/10">
                    <MapPin className="h-3.5 w-3.5 text-[#417099]" />
                  </div>
                  Distritos
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-3xl font-bold text-[#00AEC3] sm:text-4xl">{metrics.uniqueDistritos}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e81f76] to-[#417099]" />
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e81f76]/10">
                    <Users className="h-3.5 w-3.5 text-[#e81f76]" />
                  </div>
                  Matrícula
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-3xl font-bold text-[#e81f76] sm:text-4xl">{metrics.matriculaTotal.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Buscador */}
        <section>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-[#417099] sm:text-lg">Buscador</h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Busca por CUE, predio, nombre de escuela, distrito, o código de organismo (ej: jd001, jr01)
            </p>
          </div>
          <Card className="relative overflow-hidden border border-slate-200/60 shadow-lg bg-white">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AEC3] to-[#e81f76]" />
            <CardContent className="pt-5 pb-5 bg-slate-50/50">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="CUE, predio, nombre, jd001, jr01..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="pl-9 text-sm border-slate-300 bg-white shadow-sm"
                    disabled={isSearching}
                  />
                </div>
                <Button
                  onClick={() => handleSearch()}
                  disabled={isSearching || !searchTerm.trim()}
                  className="bg-[#00AEC3] hover:bg-[#0098ad] text-white shadow-md"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
                {searchTerm && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-100 bg-transparent"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resultados */}
        {hasSearched ? (
          <section>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-[#417099] sm:text-lg">Resultados</h2>
            </div>
            <SearchResults results={results} isSearching={isSearching} />
          </section>
        ) : (
          <section>
            <Card className="relative overflow-hidden border-2 border-dashed border-slate-300/60 shadow-sm bg-slate-50/30">
              <CardContent className="flex min-h-[200px] items-center justify-center sm:min-h-[260px]">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100/50 border border-slate-200">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-base font-medium text-slate-700">Ingresá un término de búsqueda</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Nombre, CUE, predio, distrito, o código de organismo
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  )
}
