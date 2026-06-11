import {
  BatteryCharging,
  CircleDot,
  Gauge,
  Lightbulb,
  PackageOpen,
  Settings2,
  Sofa,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../shared/components/Badge";
import { CarModelViewer } from "../components/CarModelViewer";
import { getVehicleZone, vehicleZones, type VehicleZoneId } from "../data/vehicleAssembly";

const zoneIcons: Record<VehicleZoneId, LucideIcon> = {
  hood: Gauge,
  engine: Settings2,
  wheels: CircleDot,
  brakes: Wrench,
  headlights: Lightbulb,
  trunk: PackageOpen,
  battery: BatteryCharging,
  interior: Sofa,
};

export function Vehicle3DPage() {
  const [selectedZone, setSelectedZone] = useState<VehicleZoneId>("engine");
  const initialZone = getVehicleZone("engine");
  const [selectedComponent, setSelectedComponent] = useState(initialZone.components[0].id);
  const zone = getVehicleZone(selectedZone);
  const component = zone.components.find((item) => item.id === selectedComponent) ?? zone.components[0];
  const ZoneIcon = zoneIcons[selectedZone];
  const diagnosticUrl = `/programari?mode=diagnostic&itemName=${encodeURIComponent(component.name)}&componentId=${encodeURIComponent(component.id)}&serviceName=${encodeURIComponent("AutoTech Nord")}`;

  const selectZone = (zoneId: VehicleZoneId) => {
    const nextZone = getVehicleZone(zoneId);
    setSelectedZone(zoneId);
    setSelectedComponent(nextZone.components[0].id);
  };

  return (
    <>
      <div className="page-heading compact">
        <div>
          <span className="eyebrow">VEHICLE DIGITAL TWIN</span>
          <h1>Model auto standard 3D</h1>
          <p>Automobil procedural complet · Selectează zona și piesa pentru inspecție.</p>
        </div>
        <div className="live-badge"><span className="status-dot" /> MODEL ONLINE</div>
      </div>

      <div className="vehicle-workspace">
        <aside className="glass-card zones-panel">
          <span className="panel-label">ZONE VEHICUL</span>
          <div className="zone-tabs">
            {vehicleZones.map(({ id, label }) => {
              const Icon = zoneIcons[id];
              return (
                <button key={id} title={label} className={selectedZone === id ? "zone-tab active" : "zone-tab"} onClick={() => selectZone(id)}>
                  <Icon /><span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="component-list-heading">
            <span>COMPONENTE {zone.label.toUpperCase()}</span>
            <b>{zone.components.length}</b>
          </div>
          <div className="component-list">
            {zone.components.map((item, index) => (
              <button
                key={item.id}
                className={component.id === item.id ? "component-button active" : "component-button"}
                onClick={() => setSelectedComponent(item.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><b>{item.name}</b><small>{item.serviceInterval}</small></div>
                <i />
              </button>
            ))}
          </div>
        </aside>

        <div className="glass-card model-stage">
          <div className="scan-line" />
          <div className="model-hud top-left"><span>INSPECTION MODE</span><b>CAROSERIE TRANSPARENTĂ</b></div>
          <div className="model-selection">
            <span>{zone.label}</span>
            <b>{component.name}</b>
          </div>
          <div className="model-hud bottom-right"><span>DRAG TO ROTATE</span><b>SCROLL TO ZOOM · CLICK PART</b></div>
          <CarModelViewer
            selectedZone={selectedZone}
            selectedComponent={component.id}
            onSelectComponent={setSelectedComponent}
          />
        </div>

        <aside className="glass-card zone-details">
          <span className="panel-label">PIESĂ SELECTATĂ</span>
          <div className="large-zone-icon"><ZoneIcon /></div>
          <span className="detail-zone-name">{zone.label}</span>
          <h2>{component.name}</h2>
          <p>{component.description}</p>
          <div className="diagnostic-list">
            <div><span>Stare estimată</span><b>Operațional</b></div>
            <div><span>Service recomandat</span><b>{component.serviceInterval}</b></div>
            <div><span>Stoc compatibil</span><b>{component.stock} buc.</b></div>
          </div>
          <Link className="button secondary" to={diagnosticUrl}>Programează diagnoza</Link>
        </aside>
      </div>

      <div className="section-title">
        <div><span>COMPATIBILITATE AUTOMATĂ</span><h2>Componente pentru {zone.label.toLowerCase()}</h2></div>
        <Link to="/piese">Vezi catalogul complet</Link>
      </div>
      <div className="parts-strip">
        {zone.components.slice(0, 3).map((item) => (
          <button className={`glass-card compact-part-card selectable ${component.id === item.id ? "active" : ""}`} key={item.id} onClick={() => setSelectedComponent(item.id)}>
            <div className="part-visual"><ZoneIcon /></div>
            <div><Badge>ÎN STOC · {item.stock}</Badge><h3>{item.name}</h3><p>{item.description}</p></div>
            <strong>{item.price.toLocaleString("ro-RO")} <small>lei</small></strong>
            <span>Vezi în model</span>
          </button>
        ))}
      </div>
    </>
  );
}
