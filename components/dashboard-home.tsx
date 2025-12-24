"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  totalOrganismos: number // Added organismos to metrics type
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
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const router = useRouter()

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only access sessionStorage on the client side
    if (typeof window === "undefined") return

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
    if (typeof window === "undefined") return

    if (searchTerm) {
      sessionStorage.setItem("searchTerm", searchTerm)
    } else {
      sessionStorage.removeItem("searchTerm")
    }
  }, [searchTerm])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (results.length > 0) {
      sessionStorage.setItem("searchResults", JSON.stringify(results))
    } else {
      sessionStorage.removeItem("searchResults")
    }
  }, [results])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (hasSearched) {
      sessionStorage.setItem("hasSearched", "true")
    } else {
      sessionStorage.removeItem("hasSearched")
    }
  }, [hasSearched])

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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("searchTerm")
      sessionStorage.removeItem("searchResults")
      sessionStorage.removeItem("hasSearched")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-md">
                <Building2 className="h-7 w-7 text-[#417099]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold leading-tight text-white">Editor de Establecimientos Educativos</h1>
                <p className="text-sm text-white/90">Provincia de Buenos Aires</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/establecimientos/nuevo")}
              className="bg-[#e81f76] hover:bg-[#c71963] text-white shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Establecimiento
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 px-4 py-8 space-y-8">
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#417099]">Métricas Generales</h2>
            <p className="text-sm text-slate-600">Resumen estadístico del sistema</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Establecimientos */}
            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AEC3] to-[#417099]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00AEC3]/10">
                    <Building2 className="h-4 w-4 text-[#00AEC3]" />
                  </div>
                  Total Establecimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#417099]">{metrics.totalEstablecimientos.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1]/10">
                    <Building2 className="h-4 w-4 text-[#6366f1]" />
                  </div>
                  Organismos Descentralizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#6366f1]">{metrics.totalOrganismos.toLocaleString()}</p>
              </CardContent>
            </Card>

            {/* Distritos */}
            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#417099] to-[#00AEC3]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#417099]/10">
                    <MapPin className="h-4 w-4 text-[#417099]" />
                  </div>
                  Distritos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#00AEC3]">{metrics.uniqueDistritos}</p>
              </CardContent>
            </Card>

            {/* Matrícula Total */}
            <Card className="relative overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e81f76] to-[#417099]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e81f76]/10">
                    <Users className="h-4 w-4 text-[#e81f76]" />
                  </div>
                  Matrícula Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#e81f76]">{metrics.matriculaTotal.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#417099]">Buscador de establecimientos</h2>
            <p className="text-sm text-slate-600">Busca por CUE, PREDIO, tipo de escuela, o nombre</p>
          </div>
          <Card className="relative overflow-hidden border border-slate-200/60 shadow-lg bg-white">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AEC3] to-[#e81f76]" />
            <CardContent className="pt-6 pb-6 bg-slate-50/50">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por CUE, PREDIO, nombre..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="pl-10 text-base border-slate-300 bg-white shadow-sm"
                    disabled={isSearching}
                  />
                </div>
                <Button
                  onClick={() => handleSearch()}
                  disabled={isSearching || !searchTerm.trim()}
                  className="bg-[#00AEC3] hover:bg-[#0098ad] text-white shadow-md hover:shadow-lg transition-shadow"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
                {searchTerm && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-100 shadow-sm bg-transparent"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {hasSearched && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#417099]">Resultados</h2>
              <p className="text-sm text-slate-600">Establecimientos encontrados</p>
            </div>
            <SearchResults results={results} isSearching={isSearching} />
          </section>
        )}

        {!hasSearched && (
          <section>
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
    </div>
  )
}
