import { motion } from "framer-motion";
import { ArrowRight, Car, Check, Cpu, Fuel, Gauge, Hash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

const models: Record<string, string[]> = {
  Volkswagen: ["Golf 7", "Passat B8", "Tiguan"],
  BMW: ["Seria 3", "Seria 5", "X3"],
  Audi: ["A4", "A6", "Q5"],
  Dacia: ["Logan", "Duster", "Sandero"],
};

export function CarSelectorPage() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState("Volkswagen");
  const [model, setModel] = useState("Golf 7");
  const [year, setYear] = useState("2017");
  const [engine, setEngine] = useState("1.6 TDI · 115 CP");

  const openModel = () => {
    localStorage.setItem("autoassist-car", JSON.stringify({ brand, model, year, engine }));
    navigate("/model-3d");
  };

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">CONFIGURATOR VEHICUL</span><h1>Mașina mea</h1><p>Configurează vehiculul pentru recomandări precise.</p></div>
        <span className="step-indicator">PASUL 1 DIN 2</span>
      </div>
      <div className="configurator">
        <Card className="config-form">
          <div className="form-section"><span>01</span><div><h3>Alege marca</h3><p>Selectează producătorul vehiculului</p></div></div>
          <div className="brand-grid">
            {Object.keys(models).map((name) => (
              <button key={name} className={brand === name ? "brand-choice selected" : "brand-choice"}
                onClick={() => { setBrand(name); setModel(models[name][0]); }}>
                <Car /> <span>{name}</span>{brand === name && <Check />}
              </button>
            ))}
          </div>
          <div className="form-section"><span>02</span><div><h3>Detalii tehnice</h3><p>Alege modelul, anul și motorizarea</p></div></div>
          <div className="field-grid">
            <label><span><Gauge /> Model</span><select value={model} onChange={(e) => setModel(e.target.value)}>{models[brand].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span><Hash /> An fabricație</span><select value={year} onChange={(e) => setYear(e.target.value)}>{Array.from({ length: 15 }, (_, i) => 2024 - i).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span><Cpu /> Motorizare</span><select value={engine} onChange={(e) => setEngine(e.target.value)}><option>1.6 TDI · 115 CP</option><option>2.0 TDI · 150 CP</option><option>1.5 TSI · 150 CP</option></select></label>
            <label><span><Fuel /> Combustibil</span><select><option>Diesel</option><option>Benzină</option><option>Hibrid</option><option>Electric</option></select></label>
          </div>
          <Button onClick={openModel} className="wide-button">Deschide modelul 3D <ArrowRight /></Button>
        </Card>
        <motion.div className="glass-card config-preview" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
          <span className="preview-label">CONFIGURAȚIA TA</span>
          <div className="wireframe-car"><Car strokeWidth={0.7} /></div>
          <h2>{brand} {model}</h2><p>{year} · {engine}</p>
          <div className="spec-strip"><div><b>115</b><span>CP</span></div><div><b>4.2</b><span>L/100 KM</span></div><div><b>EURO 6</b><span>NORMĂ</span></div></div>
          <small><span className="status-dot" /> Compatibilitate verificată cu baza AutoAssist</small>
        </motion.div>
      </div>
    </>
  );
}

