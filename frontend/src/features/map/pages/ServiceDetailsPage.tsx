import { ArrowLeft, CalendarPlus, Clock3, MapPin, MessageSquareText, Phone, Star, Wrench } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { services } from "../../../shared/data/mockData";
import { ServicesMap } from "../components/ServicesMap";

export function ServiceDetailsPage() {
  const { id } = useParams();
  const service = services.find((item) => item.id === Number(id)) ?? services[0];
  return (
    <>
      <Link className="back-link" to="/service-uri"><ArrowLeft /> Înapoi la hartă</Link>
      <div className="service-hero glass-card">
        <div className="service-hero-icon"><Wrench /></div>
        <div><span className="eyebrow">PARTENER AUTOASSIST VERIFICAT</span><h1>{service.name}</h1><p><MapPin /> {service.address}, București</p><div className="rating"><Star fill="currentColor" /> <b>{service.rating}</b><span>128 recenzii</span></div></div>
        <div className="service-hero-actions"><Link className="button" to="/programari"><CalendarPlus /> Programare</Link><Link className="button secondary" to="/chat"><MessageSquareText /> Chat</Link></div>
      </div>
      <div className="service-detail-grid">
        <div className="glass-card services-offered"><span className="panel-label">SERVICII DISPONIBILE</span><h2>Expertiză completă</h2>
          {["Diagnoză computerizată", "Revizie și mentenanță", "Sistem de frânare", "Electrică auto", "Anvelope și geometrie", "Climatizare"].map((item) => <div key={item}><span className="status-dot" /> {item}<b>Disponibil</b></div>)}
        </div>
        <div className="glass-card mini-map"><ServicesMap items={[service]} activeId={service.id} /></div>
        <div className="glass-card contact-panel"><span className="panel-label">CONTACT & PROGRAM</span>
          <div><Phone /><span>Telefon</span><strong>021 555 0101</strong></div>
          <div><Clock3 /><span>Luni - Vineri</span><strong>08:00 - 19:00</strong></div>
          <div><Clock3 /><span>Sâmbătă</span><strong>09:00 - 15:00</strong></div>
        </div>
      </div>
    </>
  );
}

