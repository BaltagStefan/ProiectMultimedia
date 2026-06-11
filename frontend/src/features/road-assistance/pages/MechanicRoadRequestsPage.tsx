import { CheckCircle2, FileText, MapPin, MessageSquareText, Navigation, PlayCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AutoService } from "../../../shared/data/mockData";
import { api } from "../../../shared/services/api";
import { errorMessage, RoadRequestView } from "../../../shared/services/workflows";
import { ServicesMap } from "../../map/components/ServicesMap";

const flow: RoadRequestView["status"][] = ["NEW", "ASSIGNED", "ON_THE_WAY", "IN_PROGRESS", "COMPLETED"];
const labels: Record<RoadRequestView["status"], string> = {
  NEW: "Cerere primită",
  ASSIGNED: "Echipă alocată",
  ON_THE_WAY: "În drum",
  IN_PROGRESS: "În lucru",
  COMPLETED: "Finalizată",
  CANCELED: "Anulată",
};

export function MechanicRoadRequestsPage() {
  const [requests, setRequests] = useState<RoadRequestView[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const response = await api.get<RoadRequestView[]>("/mechanic/road-assistance");
      setRequests(response.data);
      setSelectedId((current) => current && response.data.some((item) => item.id === current) ? current : response.data[0]?.id ?? null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(load, 7_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const selected = requests.find((item) => item.id === selectedId) ?? null;
  const markers = useMemo<AutoService[]>(() => requests.map((request) => ({
    id: request.id,
    name: request.requesterName ?? "Utilizator",
    type: "ROAD_ASSISTANCE",
    address: request.problemDescription,
    rating: 5,
    lat: request.latitude,
    lng: request.longitude,
  })), [requests]);

  const updateStatus = async (request: RoadRequestView, status: RoadRequestView["status"]) => {
    setUpdating(true);
    try {
      await api.put(`/road-assistance/${request.id}/status`, { status });
      await load();
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setUpdating(false);
    }
  };

  const nextStatus = selected ? flow[flow.indexOf(selected.status) + 1] : undefined;
  const active = requests.filter((item) => !["COMPLETED", "CANCELED"].includes(item.status));

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow danger-text">DISPECERAT RUTIER</span><h1>Cereri de asistență</h1><p>Intervenții active actualizate automat.</p></div>
        <div className="live-badge"><span className="status-dot" /> {active.length} CERERI ACTIVE</div>
      </div>
      {error && <div className="inline-error page-error">{error}</div>}
      <div className="road-requests-layout">
        <div className="requests-list">
          {requests.length === 0 && <div className="glass-card empty-state"><Navigation /><h3>Nu există cereri.</h3></div>}
          {requests.map((item) => (
            <article className={`glass-card road-request ${selectedId === item.id ? "active" : ""}`} key={item.id} onClick={() => setSelectedId(item.id)}>
              <div className="request-top"><span className={item.status === "NEW" ? "urgent" : ""}>{labels[item.status]}</span><b>#{item.id}</b></div>
              <h3>{item.problemType ?? "Asistență rutieră"}</h3>
              <p>{item.requesterName ?? "Utilizator"} · {item.problemDescription}</p>
              <p><MapPin /> {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</p>
              <div className="request-actions">
                {item.status === "NEW" ? (
                  <button onClick={(event) => { event.stopPropagation(); void updateStatus(item, "ASSIGNED"); }}><Navigation /> Preia</button>
                ) : (
                  <button onClick={(event) => { event.stopPropagation(); setSelectedId(item.id); }}><Navigation /> Selectează</button>
                )}
                <button title="Deschide chat" onClick={(event) => { event.stopPropagation(); navigate("/chat"); }}><MessageSquareText /></button>
              </div>
            </article>
          ))}
        </div>
        <div className="glass-card request-map">
          <ServicesMap items={markers} activeId={selectedId ?? undefined} onSelect={(marker) => setSelectedId(marker.id)} linkDetails={false} />
          {selected && (
            <div className="map-floating-card">
              <span>INTERVENȚIE SELECTATĂ</span><h3>{selected.requesterName ?? "Utilizator"}</h3><p>{selected.problemDescription}</p>
              <a className="button" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}><Navigation /> Deschide navigația</a>
            </div>
          )}
        </div>
        <aside className="glass-card intervention-flow">
          <span className="panel-label">STATUS INTERVENȚIE</span>
          <h2>{selected ? `AA-${selected.id}` : "Nicio selecție"}</h2>
          {flow.map((status, index) => {
            const currentIndex = selected ? flow.indexOf(selected.status) : -1;
            const Icon = index <= currentIndex ? CheckCircle2 : status === "IN_PROGRESS" ? PlayCircle : Navigation;
            return <div className={`flow-step ${index < currentIndex ? "done" : index === currentIndex ? "current" : ""}`} key={status}><Icon /><span>{labels[status]}</span></div>;
          })}
          {selected?.mediaId && <a className="request-attachment" href={`/api/media/${selected.mediaId}/download`}><FileText /> {selected.mediaName}</a>}
          {selected && nextStatus && <button className="button wide-button" disabled={updating} onClick={() => void updateStatus(selected, nextStatus)}>{updating ? "Se actualizează..." : labels[nextStatus]}</button>}
        </aside>
      </div>
    </>
  );
}
