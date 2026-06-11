import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import type { AutoService } from "../../../shared/data/mockData";

const colors = {
  PLATFORM_PARTNER: "#38bdf8",
  RAR_ITP_MOCK: "#a78bfa",
  ROAD_ASSISTANCE: "#22c55e",
};

export function ServicesMap({ items, activeId, onSelect }: {
  items: AutoService[];
  activeId?: number;
  onSelect?: (service: AutoService) => void;
}) {
  return (
    <MapContainer center={[44.435, 26.102]} zoom={12} scrollWheelZoom className="leaflet-map">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {items.map((service) => (
        <CircleMarker key={service.id} center={[service.lat, service.lng]}
          radius={activeId === service.id ? 13 : 9}
          pathOptions={{ color: colors[service.type], fillColor: colors[service.type], fillOpacity: .85, weight: 3 }}
          eventHandlers={{ click: () => onSelect?.(service) }}>
          <Popup>
            <div className="map-popup"><b>{service.name}</b><span>{service.address}</span><strong>★ {service.rating}</strong><Link to={`/service-uri/${service.id}`}>Vezi detalii</Link></div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

