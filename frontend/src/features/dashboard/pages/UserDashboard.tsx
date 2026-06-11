import { motion } from "framer-motion";
import { CalendarCheck2, Car, ChevronRight, LifeBuoy, MapPinned, MessageSquareText, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { StatCard } from "../components/StatCard";

const actions = [
  { title: "Explorează mașina în 3D", text: "Selectează vizual zona și găsește piesele potrivite.", to: "/model-3d", icon: Car, accent: "blue" },
  { title: "Găsește un service", text: "Vezi partenerii disponibili pe harta Bucureștiului.", to: "/service-uri", icon: MapPinned, accent: "green" },
  { title: "Ai rămas în drum?", text: "Trimite locația și primești rapid asistență.", to: "/asistenta", icon: LifeBuoy, accent: "orange" },
];

export function UserDashboard() {
  const auth = useAuth();
  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">CENTRU DE CONTROL</span><h1>Bun venit, {auth.username}</h1><p>Tot ce are nevoie mașina ta, într-un singur loc.</p></div>
        <Link className="button" to="/masina-mea"><Car size={18} /> Configurează mașina</Link>
      </div>
      <div className="stats-grid">
        <StatCard icon={Car} value="1" label="Mașină salvată" trend="VW Golf 7 · Activă" />
        <StatCard icon={CalendarCheck2} value="2" label="Programări" trend="Următoarea: 14 iun." tone="green" />
        <StatCard icon={LifeBuoy} value="0" label="Cereri active" trend="Drumuri fără griji" tone="orange" />
        <StatCard icon={MessageSquareText} value="3" label="Conversații" trend="1 mesaj nou" tone="violet" />
      </div>
      <div className="section-title"><div><span>ACȚIUNI RAPIDE</span><h2>Cu ce te putem ajuta?</h2></div></div>
      <div className="action-grid">
        {actions.map(({ title, text, to, icon: Icon, accent }, index) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}>
            <Link className={`glass-card action-card accent-${accent}`} to={to}>
              <div className="action-icon"><Icon /></div><h3>{title}</h3><p>{text}</p>
              <span>Deschide <ChevronRight size={16} /></span>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="dashboard-split">
        <div className="glass-card car-health">
          <div className="card-header"><div><span>STARE VEHICUL</span><h3>Volkswagen Golf 7</h3></div><span className="health-score">92%</span></div>
          <div className="car-silhouette"><Car strokeWidth={1} /></div>
          <div className="health-bars">
            <div><span>Motor</span><i><b style={{ width: "96%" }} /></i><em>Excelent</em></div>
            <div><span>Baterie</span><i><b style={{ width: "78%" }} /></i><em>Bună</em></div>
            <div><span>Frâne</span><i><b style={{ width: "64%" }} /></i><em>Verifică</em></div>
          </div>
        </div>
        <div className="glass-card appointment-preview">
          <div className="card-header"><div><span>URMĂTOAREA PROGRAMARE</span><h3>Revizie periodică</h3></div><CalendarCheck2 /></div>
          <strong>14 IUN</strong><h4>AutoTech Nord</h4><p>10:30 · Șoseaua Pipera 46</p>
          <Link to="/programari">Vezi toate programările <ChevronRight size={16} /></Link>
        </div>
      </div>
    </>
  );
}

