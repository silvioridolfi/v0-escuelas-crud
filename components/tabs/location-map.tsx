"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix default marker icons not loading correctly when bundled.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export function LocationMap({
  lat,
  lon,
  nombre,
  direccion,
}: {
  lat: number
  lon: number
  nombre: string
  direccion?: string | null
}) {
  useEffect(() => {
    // Ensure Leaflet recalculates size after mount inside a tab panel.
    window.dispatchEvent(new Event("resize"))
  }, [])

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]} icon={markerIcon}>
        <Popup>
          <span className="font-medium">{nombre}</span>
          {direccion && (
            <>
              <br />
              {direccion}
            </>
          )}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
