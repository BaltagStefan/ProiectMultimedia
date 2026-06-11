import { CalendarCheck2, CircleDollarSign, LifeBuoy, MessageSquareText, PackageCheck, Wrench } from "lucide-react";
import { StatCard } from "../components/StatCard";

export function MechanicDashboard() {
  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">SERVICE COMMAND CENTER</span><h1>Atelier în control</h1><p>Programări, intervenții și stocuri actualizate în timp real.</p></div>
        <span className="button"><Wrench size={18} /> AutoTech Nord</span>
      </div>
      <div className="stats-grid mechanic-stats">
        <StatCard icon={CalendarCheck2} value="8" label="Programări azi" trend="+2 față de ieri" />
        <StatCard icon={LifeBuoy} value="3" label="Cereri rutiere" trend="1 intervenție urgentă" tone="orange" />
        <StatCard icon={PackageCheck} value="146" label="Piese în stoc" trend="12 cu stoc redus" tone="green" />
        <StatCard icon={MessageSquareText} value="7" label="Chat-uri active" trend="3 mesaje noi" tone="violet" />
      </div>
      <div className="dashboard-split">
        <div className="glass-card schedule-panel">
          <div className="card-header"><div><span>FLUXUL DE ASTĂZI</span><h3>Programări atelier</h3></div><b>8 total</b></div>
          {[
            ["09:00", "Andrei Popescu", "VW Golf 7", "Revizie completă", "În lucru"],
            ["11:30", "Ioana Pavel", "Audi A4", "Sistem frânare", "Confirmată"],
            ["14:00", "Radu Ene", "BMW Seria 3", "Diagnoză motor", "În așteptare"],
          ].map((item) => (
            <div className="schedule-row" key={item[0]}><strong>{item[0]}</strong><div><b>{item[1]}</b><span>{item[2]} · {item[3]}</span></div><em>{item[4]}</em></div>
          ))}
        </div>
        <div className="glass-card revenue-panel">
          <div className="card-header"><div><span>PERFORMANȚĂ LUNARĂ</span><h3>Venit estimat</h3></div><CircleDollarSign /></div>
          <strong>48.650 <small>lei</small></strong><span>+12.4% față de luna trecută</span>
          <div className="bar-chart">{[36, 58, 44, 76, 62, 88, 72, 92, 68, 84, 96, 78].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        </div>
      </div>
    </>
  );
}

