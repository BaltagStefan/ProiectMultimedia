import { CalendarDays, Car, CheckCircle2, Clock3, MapPin, Plus, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../shared/components/Button";
import { api } from "../../../shared/services/api";
import { AppointmentView, AutoServiceView, errorMessage } from "../../../shared/services/workflows";

const statusLabels: Record<AppointmentView["status"], string> = {
  PENDING: "În așteptare",
  ACCEPTED: "Acceptată",
  REJECTED: "Respinsă",
  COMPLETED: "Finalizată",
  CANCELED: "Anulată",
};

type Filter = "ALL" | AppointmentView["status"];

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentView[]>([]);
  const [services, setServices] = useState<AutoServiceView[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [appointmentsResponse, servicesResponse] = await Promise.all([
        api.get<AppointmentView[]>("/users/me/appointments"),
        api.get<AutoServiceView[]>("/services"),
      ]);
      setAppointments(appointmentsResponse.data);
      const workshopServices = servicesResponse.data.filter((item) => item.type === "PLATFORM_PARTNER");
      setServices(workshopServices);
      setServiceId((current) => current ?? workshopServices[0]?.id ?? null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!serviceId || !date || !description.trim()) {
      setError("Completează service-ul, data și descrierea.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/appointments", {
        serviceId,
        carId: null,
        partId: null,
        appointmentTime: new Date(date).toISOString(),
        description: description.trim(),
      });
      setShowForm(false);
      setDate("");
      setDescription("");
      await load();
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id: number) => {
    if (!window.confirm("Anulezi această programare?")) return;
    try {
      await api.put(`/users/me/appointments/${id}/cancel`);
      await load();
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const filtered = useMemo(
    () => filter === "ALL" ? appointments : appointments.filter((item) => item.status === filter),
    [appointments, filter],
  );

  const count = (status: AppointmentView["status"]) => appointments.filter((item) => item.status === status).length;

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">AGENDA VEHICULULUI</span><h1>Programările mele</h1><p>Urmărește vizitele și istoricul de service.</p></div>
        <Button onClick={() => setShowForm((value) => !value)}><Plus /> Programare nouă</Button>
      </div>
      {showForm && (
        <form className="glass-card inline-form" onSubmit={submit}>
          <h3>Programare rapidă</h3>
          <select value={serviceId ?? ""} onChange={(event) => setServiceId(Number(event.target.value))}>
            {services.map((service) => <option value={service.id} key={service.id}>{service.name} · {service.address}</option>)}
          </select>
          <input type="datetime-local" value={date} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setDate(event.target.value)} />
          <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descrie problema" />
          <Button type="submit" disabled={saving}>{saving ? "Se trimite..." : "Trimite cererea"}</Button>
        </form>
      )}
      {error && <div className="inline-error page-error">{error}</div>}
      <div className="appointment-tabs">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>Toate <b>{appointments.length}</b></button>
        <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>În așteptare <b>{count("PENDING")}</b></button>
        <button className={filter === "ACCEPTED" ? "active" : ""} onClick={() => setFilter("ACCEPTED")}>Acceptate <b>{count("ACCEPTED")}</b></button>
        <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Finalizate <b>{count("COMPLETED")}</b></button>
      </div>
      <div className="appointment-list">
        {filtered.length === 0 && <div className="glass-card empty-state"><CalendarDays /><h3>Nu există programări în această categorie.</h3></div>}
        {filtered.map((item) => {
          const appointmentDate = new Date(item.appointmentTime);
          return (
            <article className="glass-card appointment-card" key={item.id}>
              <div className="date-block">
                <strong>{appointmentDate.toLocaleDateString("ro-RO", { day: "2-digit" })}</strong>
                <span>{appointmentDate.toLocaleDateString("ro-RO", { month: "short" }).toUpperCase()}</span>
                <small>{appointmentDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</small>
              </div>
              <div className="appointment-main">
                <span className={`status ${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span>
                <h3>{item.description || "Programare service"}</h3>
                <p><MapPin /> {item.serviceName ?? "Service auto"}</p>
                <p><Car /> Vehiculul selectat</p>
              </div>
              <div className="appointment-side">
                {item.status === "ACCEPTED" || item.status === "COMPLETED" ? <CheckCircle2 /> : <Clock3 />}
                <b>{statusLabels[item.status]}</b>
                <span>Actualizare automată</span>
                {(item.status === "PENDING" || item.status === "ACCEPTED") && <button className="text-danger-button" onClick={() => void cancel(item.id)}><X /> Anulează</button>}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
