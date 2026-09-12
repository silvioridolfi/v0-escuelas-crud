import Image from "next/image"

export function SiteFooter() {
  return (
    <footer
      className="w-full py-3"
      style={{
        background: "linear-gradient(90deg, var(--color-pba-pink) 0%, var(--color-pba-blue) 50%, var(--color-pba-teal) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4">
        <Image
          src="/images/logo-dte-2026.png"
          alt="Dirección de Tecnología Educativa 2026"
          width={1030}
          height={142}
          className="h-auto w-full max-w-[504px] object-contain sm:max-w-[672px]"
        />
        <p className="text-center text-2xs text-white/80">
          © {new Date().getFullYear()} Dirección de Tecnología Educativa (DTE), Región 1 ·
          Desarrollado por Silvio Ridolfi, Facilitador de Educación Digital
        </p>
      </div>
    </footer>
  )
}
