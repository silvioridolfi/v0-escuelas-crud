/**
 * Elemento decorativo de identidad visual: una "red de nodos" -- cada punto
 * representa un establecimiento, cada línea una conexión con la DTE. Se usa
 * como textura sutil en headers con degradé PBA y en el estado vacío del
 * buscador (Fase 2 del rediseño visual).
 *
 * variant="onColor": puntos/líneas blancos, para fondos con degradé PBA.
 * variant="light": puntos/líneas con los 3 colores PBA, para fondos claros.
 */
export function NodeNetworkAccent({
  variant = "onColor",
  className = "",
}: {
  variant?: "onColor" | "light"
  className?: string
}) {
  const isOnColor = variant === "onColor"
  const dotColors = isOnColor
    ? ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]
    : ["#03466e", "#03466e", "#623b75", "#cd2b7b", "#03466e", "#623b75"]
  const lineColor = isOnColor ? "#ffffff" : "#623b75"
  const lineOpacity = isOnColor ? 0.35 : 0.25
  const dotOpacity = isOnColor ? 0.9 : 1

  return (
    <svg
      viewBox="0 0 300 110"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g opacity={lineOpacity} stroke={lineColor} strokeWidth="1" fill="none">
        <line x1="30" y1="30" x2="90" y2="60" />
        <line x1="90" y1="60" x2="160" y2="25" />
        <line x1="160" y1="25" x2="230" y2="55" />
        <line x1="90" y1="60" x2="150" y2="90" />
        <line x1="230" y1="55" x2="270" y2="85" />
        <line x1="150" y1="90" x2="230" y2="55" />
      </g>
      <g opacity={dotOpacity}>
        <circle cx="30" cy="30" r="3.5" fill={dotColors[0]} />
        <circle cx="90" cy="60" r="4.5" fill={dotColors[1]} />
        <circle cx="160" cy="25" r="3.5" fill={dotColors[2]} />
        <circle cx="230" cy="55" r="4.5" fill={dotColors[3]} />
        <circle cx="150" cy="90" r="3.5" fill={dotColors[4]} />
        <circle cx="270" cy="85" r="3.5" fill={dotColors[5]} />
      </g>
    </svg>
  )
}
