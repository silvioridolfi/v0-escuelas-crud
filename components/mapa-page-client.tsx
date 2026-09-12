"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NodeNetworkAccent } from "@/components/node-network-accent"
import { ArrowLeft, Map } from "lucide-react"
import type { MapPoint } from "@/app/actions/get-map-points"

const GeneralMap = dynamic(() => import("@/components/general-map").then((mod) => mod.GeneralMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center rounded-lg border border-slate-200 bg-slate-100 dark:bg-white/10 text-sm text-muted-foreground">
      Cargando mapa…
    </div>
  ),
})

export function MapaPageClient({ points }: { points: MapPoint[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="relative overflow-hidden border-b border-blue-200 bg-gradient-to-r from-pba-blue to-pba-teal shadow-lg">
        <NodeNetworkAccent variant="onColor" className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="container relative mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Volver al buscador" className="shrink-0 text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              <Map className="h-6 w-6 shrink-0 text-white" />
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white sm:text-2xl">Mapa de Región 1</h1>
                <p className="text-sm text-white/90">Todos los establecimientos y organismos, con filtros por distrito y FED</p>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div id="main-content" className="container mx-auto px-4 py-6 sm:py-8">
        <GeneralMap points={points} />
      </div>
    </div>
  )
}
