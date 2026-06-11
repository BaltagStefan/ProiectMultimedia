import { CalendarDays, Check, MessageSquareText, X } from "lucide-react";

export function MechanicCalendarPage() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">PLANIFICARE ATELIER</span><h1>Calendar service</h1><p>Gestionează programările echipei.</p></div><span className="button secondary"><CalendarDays /> Iunie 2026</span></div>
      <div className="calendar-board glass-card">
        <div className="calendar-header"><button>Azi</button><button className="active">Săptămâna</button><button>Luna</button></div>
        {[
          ["09:00", "Andrei Popescu", "VW Golf 7", "Revizie completă", "accepted"],
          ["10:30", "Ioana Pavel", "Audi A4", "Plăcuțe frână", "pending"],
          ["12:00", "Radu Ene", "BMW Seria 3", "Diagnoză motor", "pending"],
          ["14:30", "Mara Tudor", "Dacia Duster", "Schimb ulei", "accepted"],
        ].map((item) => <div className="mechanic-appointment" key={item[0]}><strong>{item[0]}</strong><div><b>{item[1]}</b><span>{item[2]} · {item[3]}</span></div><em className={item[4]}>{item[4] === "accepted" ? "Acceptată" : "Nouă"}</em><div className="row-actions"><button title="Acceptă"><Check /></button><button title="Respinge"><X /></button><button title="Chat"><MessageSquareText /></button></div></div>)}
      </div>
    </>
  );
}

