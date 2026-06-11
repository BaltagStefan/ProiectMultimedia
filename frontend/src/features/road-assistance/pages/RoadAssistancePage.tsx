import { Camera, Crosshair, LifeBuoy, MapPin, Mic, Send, ShieldCheck, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { services } from "../../../shared/data/mockData";
import { ServicesMap } from "../../map/components/ServicesMap";

export function RoadAssistancePage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow danger-text">ASISTENȚĂ 24/7</span><h1>Ajutor rutier</h1><p>Trimite locația și problema. Echipa apropiată va răspunde imediat.</p></div><div className="response-time"><LifeBuoy /><div><span>TIMP MEDIU RĂSPUNS</span><strong>12 minute</strong></div></div></div>
      {sent ? <div className="glass-card request-sent"><div className="pulse-icon"><Send /></div><span className="eyebrow">CERERE TRANSMISĂ</span><h2>RoadHelp 24 este în drum</h2><p>Echipa a primit locația și detaliile tale. Poți urmări intervenția din această pagină.</p><div className="tracking-line"><i className="done" /><span /><i className="active" /><span /><i /></div><div className="tracking-labels"><b>Cerere trimisă</b><b>Echipă alocată</b><b>În drum</b></div><Button onClick={() => setSent(false)}>Cerere nouă</Button></div> :
      <div className="road-grid">
        <div className="glass-card road-form"><span className="panel-label">DETALII INTERVENȚIE</span><h2>Ce s-a întâmplat?</h2>
          <label><span>Tip problemă</span><select><option>Mașina nu pornește</option><option>Pană de cauciuc</option><option>Accident</option><option>Defecțiune motor</option><option>Altă problemă</option></select></label>
          <label><span>Descriere</span><textarea placeholder="Descrie pe scurt problema și orice detaliu util..." /></label>
          <span className="field-label">Atașamente</span><div className="media-buttons"><button><Camera /> Foto</button><button><Video /> Video</button><button><Mic /> Audio</button></div>
          <label><span>Service apropiat</span><select>{services.filter((item) => item.type === "ROAD_ASSISTANCE").map((item) => <option key={item.id}>{item.name} · {item.rating} ★</option>)}</select></label>
          <Button className="danger wide-button" onClick={() => setSent(true)}><LifeBuoy /> Trimite cererea de ajutor</Button>
          <small className="privacy-note"><ShieldCheck /> Locația este transmisă doar echipei alocate.</small>
        </div>
        <div className="glass-card location-card"><div className="location-map"><ServicesMap items={services.filter((item) => item.type === "ROAD_ASSISTANCE")} /></div><div className="location-info"><div><MapPin /><span>LOCAȚIA CURENTĂ</span><strong>Splaiul Unirii, București</strong></div><button><Crosshair /> Actualizează</button></div></div>
      </div>}
    </>
  );
}

