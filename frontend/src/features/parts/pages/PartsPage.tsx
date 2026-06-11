import { Search, Settings2, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../shared/components/Badge";
import { parts } from "../../../shared/data/mockData";

export function PartsPage() {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("all");
  const filtered = useMemo(() => parts.filter((part) =>
    (zone === "all" || part.zone === zone) && part.name.toLowerCase().includes(query.toLowerCase())), [query, zone]);
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">CATALOG INTELIGENT</span><h1>Piese compatibile</h1><p>Rezultate verificate pentru configurația vehiculului tău.</p></div><Badge>VW GOLF 7 · 2017</Badge></div>
      <div className="glass-card filters-bar">
        <label className="search-field"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Caută după numele piesei..." /></label>
        <select value={zone} onChange={(e) => setZone(e.target.value)}><option value="all">Toate zonele</option><option value="engine">Motor</option><option value="brakes">Frâne</option><option value="battery">Baterie</option><option value="wheels">Roți</option><option value="headlights">Faruri</option></select>
        <button className="button secondary"><SlidersHorizontal /> Filtre avansate</button>
      </div>
      <div className="result-meta"><span>{filtered.length} piese găsite</span><select><option>Recomandate</option><option>Preț crescător</option><option>Stoc disponibil</option></select></div>
      <div className="parts-grid">
        {filtered.map((part) => (
          <article className="glass-card part-card" key={part.id}>
            <div className="part-image"><Settings2 /><span>VERIFICAT 3D</span></div>
            <Badge>{part.stock > 5 ? "ÎN STOC" : "STOC LIMITAT"} · {part.stock}</Badge>
            <h3>{part.name}</h3><p>{part.compatibility}</p>
            <div className="part-card-footer"><strong>{part.price} <small>lei</small></strong><Link className="button small" to={`/piese/${part.id}`}>Vezi piesa</Link></div>
          </article>
        ))}
      </div>
    </>
  );
}

