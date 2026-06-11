import { CheckCircle2, MapPin, MessageSquareText, Navigation, Phone, PlayCircle } from "lucide-react";
import { services } from "../../../shared/data/mockData";
import { ServicesMap } from "../../map/components/ServicesMap";

export function MechanicRoadRequestsPage() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow danger-text">DISPECERAT RUTIER</span><h1>Cereri de asistență</h1><p>Intervenții active ordonate după distanță și prioritate.</p></div><div className="live-badge"><span className="status-dot" /> 3 CERERI ACTIVE</div></div>
      <div className="road-requests-layout">
        <div className="requests-list">
          {[
            ["URGENT", "Mașina nu pornește", "Andrei Popescu", "VW Golf 7", "1.8 km", "Splaiul Unirii"],
            ["NOU", "Pană roată dreapta față", "Mara Tudor", "Dacia Duster", "4.2 km", "Bd. Timișoara"],
            ["ÎN DRUM", "Supraîncălzire motor", "Radu Ene", "BMW Seria 3", "6.1 km", "Calea Floreasca"],
          ].map((item, index) => <article className={`glass-card road-request ${index === 0 ? "active" : ""}`} key={item[2]}><div className="request-top"><span className={index === 0 ? "urgent" : ""}>{item[0]}</span><b>{item[4]}</b></div><h3>{item[1]}</h3><p>{item[2]} · {item[3]}</p><p><MapPin /> {item[5]}</p><div className="request-actions"><button><Navigation /> Preia</button><button><Phone /></button><button><MessageSquareText /></button></div></article>)}
        </div>
        <div className="glass-card request-map"><ServicesMap items={services.filter((item) => item.type === "ROAD_ASSISTANCE")} /><div className="map-floating-card"><span>INTERVENȚIE SELECTATĂ</span><h3>Andrei Popescu</h3><p>1.8 km · aproximativ 7 minute</p><button className="button"><Navigation /> Deschide navigația</button></div></div>
        <aside className="glass-card intervention-flow"><span className="panel-label">STATUS INTERVENȚIE</span><h2>AA-2026-1042</h2>{[["Cerere primită", CheckCircle2, "done"], ["Echipă alocată", CheckCircle2, "done"], ["În drum", Navigation, "current"], ["În lucru", PlayCircle, ""], ["Finalizată", CheckCircle2, ""]].map(([label, Icon, state]) => { const StepIcon = Icon as typeof CheckCircle2; return <div className={`flow-step ${state}`} key={String(label)}><StepIcon /><span>{String(label)}</span></div>; })}<button className="button wide-button">Sunt pe drum</button></aside>
      </div>
    </>
  );
}

