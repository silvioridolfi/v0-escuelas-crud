"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Map } from "lucide-react"
import type { MapPoint } from "@/app/actions/get-map-points"

const GeneralMap = dynamic(() => import("@/components/general-map").then((mod) => mod.GeneralMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/60 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
})

export function MapaPageClient({ points }: { points: MapPoint[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-blue-200 bg-gradient-to-r from-[#417099] to-[#00AEC3] shadow-lg">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 sm:py-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0 text-white hover:bg-card/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Map className="h-6 w-6 text-white" />
            <div>
              <h1 className="text-lg font-bold text-white sm:text-2xl">Mapa de Región 1</h1>
              <p className="text-sm text-white/90">Todos los establecimientos y organismos, con filtros por distrito y FED</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <GeneralMap points={points} />
      </div>
    </div>
  )
}
