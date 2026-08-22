// Tipo canónico de un establecimiento educativo, tal como lo devuelve
// `select("*")` sobre la tabla `establecimientos`. Antes cada componente
// (tabs, editors, dialogs) declaraba su propia versión parcial de este tipo
// bajo el mismo nombre "Establecimiento", lo cual hacía que TypeScript los
// tratara como tipos distintos e incompatibles entre sí (TS2719/TS2740) al
// pasarse el mismo objeto de un componente a otro.
//
// Cada componente que solo necesita un subconjunto de campos puede usar
// `Pick<Establecimiento, "id" | "nombre" | ...>` en vez de redeclarar el tipo.
export type Establecimiento = {
  id: string
  cue: number
  predio: number | null
  nombre: string
  alias: string | null
  distrito: string
  ciudad: string
  direccion: string
  lat: number | null
  lon: number | null
  nivel: string
  modalidad: string
  tipo_establecimiento: string
  ambito: string
  matricula: number
  varones: number
  mujeres: number
  secciones: number
  turnos: string | null
  fed_a_cargo: string
  es_establecimiento_educativo: boolean

  // Conectividad
  plan_enlace: string | null
  subplan_enlace: string | null
  fecha_inicio_conectividad: string | null
  mb: string | null
  listado_conexion_internet: string | null
  pnce_estado: string | null
  proveedor_internet_pnce: string | null
  fecha_instalacion_pnce: string | null
  pnce_fecha_mejora: string | null
  pnce_tipo_mejora: string | null
  pba_grupo_1_estado: string | null
  pba_grupo_1_proveedor_internet: string | null
  pba_grupo_1_fecha_instalacion: string | null
  reclamos_grupo_1_ani: string | null
  pba_2019_estado: string | null
  pba_2019_proveedor_internet: string | null
  pba_2019_fecha_instalacion: string | null
  pba_grupo_2_a_estado: string | null
  pba_grupo_2_a_proveedor_internet: string | null
  pba_grupo_2_a_fecha_instalacion: string | null
  pba_grupo_2_a_fecha_mejora: string | null
  pba_grupo_2_a_tipo_mejora: string | null
  estado_instalacion_pba: string | null
  proveedor_asignado_pba: string | null
  plan_piso_tecnologico: string | null
  tipo_piso_instalado: string | null
  fecha_terminado_piso_tecnologico_cue: string | null
  proveedor_piso_tecnologico_cue: string | null
  fecha_mejora: string | null
  tipo_mejora: string | null

  observaciones: string | null

  [key: string]: unknown
}
