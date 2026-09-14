"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

// Aparece recién después de scrollear una pantalla completa hacia abajo,
// para no molestar en páginas cortas -- útil sobre todo en resultados
// largos (accesos rápidos como "Sin contacto" pueden dar 200+ resultados).
export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      title="Volver arriba"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-pba-purple text-white shadow-lg transition-all hover:bg-pba-purple/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pba-pink focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
