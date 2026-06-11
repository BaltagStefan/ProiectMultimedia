import { Edit3, ImagePlus, PackagePlus, Search, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { parts } from "../../../shared/data/mockData";

export function MechanicPartsPage() {
  const [form, setForm] = useState(false);
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">INVENTAR SERVICE</span><h1>Piese și stocuri</h1><p>Gestionează catalogul publicat de atelier.</p></div><Button onClick={() => setForm(!form)}><PackagePlus /> Adaugă piesă</Button></div>
      {form && <div className="glass-card part-form">
        <div><span className="panel-label">PIESĂ NOUĂ</span><h2>Detalii catalog</h2></div>
        <label className="upload-zone"><ImagePlus /><b>Încarcă imaginea piesei</b><span>PNG sau JPG, maximum 10 MB</span><input type="file" accept="image/png,image/jpeg" /></label>
        <div className="field-grid"><label><span>Nume piesă</span><input placeholder="Ex: Baterie Bosch 70Ah" /></label><label><span>Categorie</span><select><option>Electric</option><option>Motor</option><option>Frânare</option></select></label><label><span>Zonă vehicul</span><select><option>Baterie</option><option>Motor</option><option>Frâne</option></select></label><label><span>Compatibilitate</span><input placeholder="VW Golf 7, 2017" /></label><label><span>Preț (lei)</span><input type="number" /></label><label><span>Stoc</span><input type="number" /></label></div>
        <textarea placeholder="Descrierea piesei..." /><div className="form-actions"><Button onClick={() => setForm(false)}>Salvează piesa</Button><Button className="secondary" onClick={() => setForm(false)}>Anulează</Button></div>
      </div>}
      <div className="glass-card inventory-toolbar"><label className="search-field"><Search /><input placeholder="Caută în inventar..." /></label><span>146 produse · 12 cu stoc redus</span></div>
      <div className="inventory-table glass-card">
        <div className="table-head"><span>PIESĂ</span><span>COMPATIBILITATE</span><span>PREȚ</span><span>STOC</span><span>ACȚIUNI</span></div>
        {parts.map((part) => <div className="table-row" key={part.id}><div><i><Settings2 /></i><div><b>{part.name}</b><span>{part.category}</span></div></div><span>{part.compatibility}</span><strong>{part.price} lei</strong><em className={part.stock < 5 ? "low-stock" : ""}>{part.stock} buc.</em><div className="row-actions"><button><Edit3 /></button><button className="danger-icon"><Trash2 /></button></div></div>)}
      </div>
    </>
  );
}

