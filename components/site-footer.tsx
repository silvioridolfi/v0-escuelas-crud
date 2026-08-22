import Image from "next/image"

export function SiteFooter() {
  return (
    <footer
      className="w-full py-3"
      style={{
        background: "linear-gradient(90deg, #e81f76 0%, #417099 50%, #00aec3 100%)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4">
        <Image
          src="/images/logo-dte-2026.png"
          alt="Dirección de Tecnología Educativa 2026"
          width={432}
          height={76}
          className="h-auto w-full max-w-[504px] sm:max-w-[672px]"
        />
      </div>
    </footer>
  )
}
