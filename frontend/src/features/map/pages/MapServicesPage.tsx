import { LifeBuoy, MapPin, MessageSquareText, Search, Star, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { services, type AutoService } from "../../../shared/data/mockData";
import { ServicesMap } from "../components/ServicesMap";

const typeLabel = {
  PLATFORM_PARTNER: "Service partener",
  RAR_ITP_MOCK: "Stație ITP",
  ROAD_ASSISTANCE: "Asistență rutieră",
};

export function MapServicesPage() {
  const [active, setActive] = useState<AutoService>(services[0]);
  return (
    <>
      <div className="page-heading compact"><div><span className="eyebrow">AUTOASSIST NETWORK</span><h1>Service-uri în apropiere</h1><p>Parteneri verificați în București.</p></div><div className="map-legend"><span><i className="blue" /> Service</span><span><i className="violet" /> ITP</span><span><i className="green" /> Asistență</span></div></div>
      <div className="map-layout">
        <aside className="glass-card service-list">
          <label className="search-field"><Search /><input placeholder="Caută service..." /></label>
          <div className="list-scroll">{services.map((service) => (
            <button key={service.id} onClick={() => setActive(service)} className={active.id === service.id ? "service-list-item active" : "service-list-item"}>
              <div className={`service-type-icon ${service.type}`}><Wrench /></div>
              <div><strong>{service.name}</strong><span>{typeLabel[service.type]}</span><p><MapPin /> {service.address}</p></div>
              <em><Star /> {service.rating}</em>
            </button>
          ))}</div>
        </aside>
        <div className="glass-card map-wrap"><ServicesMap items={services} activeId={active.id} onSelect={setActive} /></div>
        <aside className="glass-card map-detail-card">
          <span className="panel-label">SERVICE SELECTAT</span>
          <div className={`large-zone-icon service ${active.type}`}><Wrench /></div>
          <h2>{active.name}</h2><span className="service-kind">{typeLabel[active.type]}</span>
          <div className="rating"><Star fill="currentColor" /> <b>{active.rating}</b><span>· 128 recenzii</span></div>
          <p><MapPin /> {active.address}, București</p>
          <div className="service-actions">
            <Link className="button" to={`/service-uri/${active.id}`}>Vezi service-ul</Link>
            <Link className="button secondary" to="/chat"><MessageSquareText /> Chat</Link>
            {active.type === "ROAD_ASSISTANCE" && <Link className="button danger" to="/asistenta"><LifeBuoy /> Cere ajutor</Link>}
          </div>
        </aside>
      </div>
    </>
  );
}

