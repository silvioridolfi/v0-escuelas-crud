import { getMapPoints } from "@/app/actions/get-map-points"
import { MapaPageClient } from "@/components/mapa-page-client"

export default async function MapaPage() {
  const points = await getMapPoints()

  return <MapaPageClient points={points} />
}
