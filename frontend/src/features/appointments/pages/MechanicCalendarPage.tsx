import { CalendarDays, Check, CheckCircle2, MessageSquareText, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../shared/services/api";
import { AppointmentView, errorMessage } from "../../../shared/services/workflows";

type ViewMode = "ALL" | "TODAY" | "MONTH";

export function MechanicCalendarPage() {
  const [appointments, setAppointments] = useState<AppointmentView[]>([]);
  const [mode, setMode] = useState<ViewMode>("ALL");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setAppointments((await api.get<AppointmentView[]>("/mechanic/appointments")).data);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(load, 10_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const update = async (id: number, status: AppointmentView["status"]) => {
    setUpdating(id);
    try {
      await api.put(`/mechanic/appointments/${id}/status`, { status });
      await load();
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setUpdating(null);
    }
  };

  const visible = useMemo(() => appointments.filter((item) => {
    const date = new Date(item.appointmentTime);
    const now = new Date();
    if (mode === "TODAY") return date.toDateString() === now.toDateString();
    if (mode === "MONTH") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    return true;
  }), [appointments, mode]);

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">PLANIFICARE ATELIER</span><h1>Calendar service</h1><p>Gestionează programările echipei.</p></div>
        <span className="button secondary"><CalendarDays /> {new Date().toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}</span>
      </div>
      {error && <div className="inline-error page-error">{error}</div>}
      <div className="calendar-board glass-card">
        <div className="calendar-header">
          <button className={mode === "TODAY" ? "active" : ""} onClick={() => setMode("TODAY")}>Azi</button>
          <button className={mode === "ALL" ? "active" : ""} onClick={() => setMode("ALL")}>Toate</button>
          <button className={mode === "MONTH" ? "active" : ""} onClick={() => setMode("MONTH")}>Luna</button>
        </div>
        {visible.length === 0 && <div className="empty-state"><CalendarDays /><h3>Nu există programări în perioada selectată.</h3></div>}
        {visible.map((item) => {
          const date = new Date(item.appointmentTime);
          return (
            <div className="mechanic-appointment" key={item.id}>
              <strong>{date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</strong>
              <div><b>{item.requesterName ?? "Utilizator"}</b><span>{date.toLocaleDateString("ro-RO")} · {item.description || "Programare service"}</span></div>
              <em className={item.status.toLowerCase()}>{item.status}</em>
              <div className="row-actions">
                {item.status === "PENDING" && <button disabled={updating === item.id} title="Acceptă" onClick={() => void update(item.id, "ACCEPTED")}><Check /></button>}
                {item.status === "PENDING" && <button disabled={updating === item.id} title="Respinge" className="danger-icon" onClick={() => void update(item.id, "REJECTED")}><X /></button>}
                {item.status === "ACCEPTED" && <button disabled={updating === item.id} title="Finalizează" onClick={() => void update(item.id, "COMPLETED")}><CheckCircle2 /></button>}
                <button title="Deschide chat" onClick={() => navigate("/chat")}><MessageSquareText /></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
