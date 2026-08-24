import Image from "next/image"

export function SiteFooter() {
  return (
    <footer
      className="w-full py-3"
      style={{
        background: "linear-gradient(90deg, #e81f76 0%, #417099 50%, #00aec3 100%)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4">
        <Image
          src="/images/logo-dte-2026.png"
          alt="Dirección de Tecnología Educativa 2026"
          width={432}
          height={76}
          className="h-auto w-full max-w-[504px] sm:max-w-[672px]"
        />
        <p className="text-center text-[11px] text-white/80">
          © {new Date().getFullYear()} Dirección de Tecnología Educativa (DTE), Región 1 ·
          Desarrollado por Silvio Ridolfi, Facilitador de Educación Digital
        </p>
      </div>
    </footer>
  )
}
