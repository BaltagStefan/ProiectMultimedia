import { BatteryCharging, CircleDot, Gauge, Lightbulb, PackageOpen, Settings2, Sofa, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../shared/components/Badge";
import { parts } from "../../../shared/data/mockData";
import { CarModelViewer } from "../components/CarModelViewer";

const zones = [
  { id: "hood", label: "Capotă", icon: Gauge, text: "Caroserie frontală și acces la compartimentul motor." },
  { id: "engine", label: "Motor", icon: Settings2, text: "Propulsie, admisie, răcire și distribuție." },
  { id: "wheels", label: "Roți", icon: CircleDot, text: "Anvelope, jante, rulmenți și suspensie." },
  { id: "brakes", label: "Frâne", icon: Wrench, text: "Discuri, plăcuțe, etriere și lichid." },
  { id: "headlights", label: "Faruri", icon: Lightbulb, text: "Iluminare frontală și module electronice." },
  { id: "trunk", label: "Portbagaj", icon: PackageOpen, text: "Caroserie posterioară și accesorii." },
  { id: "battery", label: "Baterie", icon: BatteryCharging, text: "Baterie, alternator și sistem de pornire." },
  { id: "interior", label: "Interior", icon: Sofa, text: "Habitaclu, climatizare și confort." },
];

export function Vehicle3DPage() {
  const [selected, setSelected] = useState("engine");
  const zone = zones.find((item) => item.id === selected)!;
  const ZoneIcon = zone.icon;
  const matchingParts = useMemo(() => parts.filter((part) => part.zone === selected), [selected]);

  return (
    <>
      <div className="page-heading compact">
        <div><span className="eyebrow">VEHICLE DIGITAL TWIN</span><h1>Volkswagen Golf 7</h1><p>2017 · 1.6 TDI · Selectează o zonă pentru diagnoză.</p></div>
        <div className="live-badge"><span className="status-dot" /> MODEL ONLINE</div>
      </div>
      <div className="vehicle-workspace">
        <aside className="glass-card zones-panel">
          <span className="panel-label">ZONE VEHICUL</span>
          {zones.map(({ id, label, icon: Icon }) => (
            <button key={id} className={selected === id ? "zone-button active" : "zone-button"} onClick={() => setSelected(id)}>
              <Icon /><span>{label}</span><i />
            </button>
          ))}
        </aside>
        <div className="glass-card model-stage">
          <div className="scan-line" />
          <div className="model-hud top-left"><span>SCAN MODE</span><b>AUTO ROTATE</b></div>
          <div className="model-hud bottom-right"><span>DRAG TO ROTATE</span><b>SCROLL TO ZOOM</b></div>
          <CarModelViewer selected={selected} />
        </div>
        <aside className="glass-card zone-details">
          <span className="panel-label">ZONĂ SELECTATĂ</span>
          <div className="large-zone-icon"><ZoneIcon /></div>
          <h2>{zone.label}</h2><p>{zone.text}</p>
          <div className="diagnostic-list">
            <div><span>Stare estimată</span><b>Operațional</b></div>
            <div><span>Ultima verificare</span><b>Acum 32 zile</b></div>
            <div><span>Piese compatibile</span><b>{matchingParts.length || 3} disponibile</b></div>
          </div>
          <button className="button secondary">Pornește diagnoza</button>
        </aside>
      </div>
      <div className="section-title"><div><span>COMPATIBILITATE AUTOMATĂ</span><h2>Piese pentru {zone.label.toLowerCase()}</h2></div><Link to="/piese">Vezi toate piesele</Link></div>
      <div className="parts-strip">
        {(matchingParts.length ? matchingParts : parts.slice(0, 3)).map((part) => (
          <div className="glass-card compact-part-card" key={part.id}>
            <div className="part-visual"><Settings2 /></div>
            <div><Badge>ÎN STOC · {part.stock}</Badge><h3>{part.name}</h3><p>{part.compatibility}</p></div>
            <strong>{part.price} <small>lei</small></strong>
            <Link to={`/piese/${part.id}`}>Detalii</Link>
          </div>
        ))}
      </div>
    </>
  );
}
