import { CalendarDays, Car, CheckCircle2, Clock3, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../shared/components/Button";

const initial = [
  { id: 1, date: "14", month: "IUN", time: "10:30", service: "AutoTech Nord", car: "VW Golf 7", issue: "Revizie periodică", status: "ACCEPTED" },
  { id: 2, date: "22", month: "IUN", time: "14:00", service: "Auto Electric Pro", car: "VW Golf 7", issue: "Verificare baterie", status: "PENDING" },
  { id: 3, date: "03", month: "MAI", time: "09:00", service: "Garage Performance", car: "VW Golf 7", issue: "Schimb plăcuțe frână", status: "COMPLETED" },
];

export function AppointmentsPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">AGENDA VEHICULULUI</span><h1>Programările mele</h1><p>Urmărește vizitele și istoricul de service.</p></div><Button onClick={() => setShowForm(!showForm)}><Plus /> Programare nouă</Button></div>
      {showForm && <div className="glass-card inline-form"><h3>Programare rapidă</h3><select><option>AutoTech Nord</option><option>Garage Performance</option></select><input type="datetime-local" /><input placeholder="Descrie problema" /><Button onClick={() => setShowForm(false)}>Trimite cererea</Button></div>}
      <div className="appointment-tabs"><button className="active">Toate <b>3</b></button><button>În așteptare <b>1</b></button><button>Acceptate <b>1</b></button><button>Finalizate <b>1</b></button></div>
      <div className="appointment-list">{initial.map((item) => (
        <article className="glass-card appointment-card" key={item.id}>
          <div className="date-block"><strong>{item.date}</strong><span>{item.month}</span><small>{item.time}</small></div>
          <div className="appointment-main"><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span><h3>{item.issue}</h3><p><MapPin /> {item.service}</p><p><Car /> {item.car}</p></div>
          <div className="appointment-side">{item.status === "ACCEPTED" ? <><CheckCircle2 /><b>Confirmată</b><span>Service-ul te așteaptă</span></> : <><Clock3 /><b>{item.status === "PENDING" ? "În confirmare" : "Finalizată"}</b><span>Actualizare automată</span></>}</div>
        </article>
      ))}</div>
    </>
  );
}

