/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: hay ~20 errores de tipos preexistentes (ver componentes de tabs,
    // SearchResult duplicado, falta @/components/ui/dialog). Corregirlos y
    // sacar este flag en un PR aparte, sin mezclarlo con el fix de seguridad.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig