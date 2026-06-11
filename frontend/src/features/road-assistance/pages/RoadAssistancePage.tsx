import { Camera, Crosshair, FileText, LifeBuoy, MapPin, Mic, Send, ShieldCheck, Video } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../shared/components/Button";
import type { AutoService } from "../../../shared/data/mockData";
import { api } from "../../../shared/services/api";
import { AutoServiceView, errorMessage, RoadRequestView, uploadMedia } from "../../../shared/services/workflows";
import { ServicesMap } from "../../map/components/ServicesMap";

const problemTypes = ["Mașina nu pornește", "Pană de cauciuc", "Accident", "Defecțiune motor", "Altă problemă"];
const statusStep: Record<RoadRequestView["status"], number> = {
  NEW: 0, ASSIGNED: 1, ON_THE_WAY: 2, IN_PROGRESS: 3, COMPLETED: 4, CANCELED: 0,
};

export function RoadAssistancePage() {
  const [requests, setRequests] = useState<RoadRequestView[]>([]);
  const [services, setServices] = useState<AutoServiceView[]>([]);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [problemType, setProblemType] = useState(problemTypes[0]);
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState({ latitude: 44.435, longitude: 26.102 });
  const [locationState, setLocationState] = useState("Locație aproximativă București");
  const [media, setMedia] = useState<{ id: number; name: string } | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const [requestResponse, serviceResponse] = await Promise.all([
        api.get<RoadRequestView[]>("/users/me/road-assistance"),
        api.get<AutoServiceView[]>("/services"),
      ]);
      setRequests(requestResponse.data);
      const roadServices = serviceResponse.data.filter((item) => item.type === "ROAD_ASSISTANCE");
      setServices(roadServices);
      setServiceId((current) => current ?? roadServices[0]?.id ?? null);
      setViewingId((current) => current ?? requestResponse.data.find((item) => !["COMPLETED", "CANCELED"].includes(item.status))?.id ?? null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(load, 8_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Browserul nu oferă acces la geolocație.");
      return;
    }
    setLocationState("Se determină locația...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationState(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
      },
      () => {
        setLocationState("Locația nu a putut fi accesată");
        setError("Permite accesul la locație și încearcă din nou.");
      },
      { enableHighAccuracy: true, timeout: 12_000 },
    );
  };

  const chooseFile = (accept: string) => {
    if (!fileInput.current) return;
    fileInput.current.accept = accept;
    fileInput.current.click();
  };

  const attach = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const uploaded = await uploadMedia(file);
      setMedia({ id: uploaded.id, name: uploaded.originalFileName });
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!serviceId || !description.trim()) {
      setError("Alege service-ul și descrie problema.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await api.post<RoadRequestView>("/road-assistance", {
        assignedServiceId: serviceId,
        latitude: position.latitude,
        longitude: position.longitude,
        problemType,
        problemDescription: description.trim(),
        mediaId: media?.id ?? null,
      });
      setDescription("");
      setMedia(null);
      setViewingId(response.data.id);
      await load();
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const current = requests.find((item) => item.id === viewingId) ?? null;
  const mapItems = useMemo<AutoService[]>(() => services.map((service) => ({
    id: service.id, name: service.name, type: service.type, address: service.address,
    rating: service.rating, lat: service.latitude, lng: service.longitude,
  })), [services]);

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow danger-text">ASISTENȚĂ 24/7</span><h1>Ajutor rutier</h1><p>Trimite locația și problema. Echipa apropiată va răspunde imediat.</p></div>
        <div className="response-time"><LifeBuoy /><div><span>CERERI ACTIVE</span><strong>{requests.filter((item) => !["COMPLETED", "CANCELED"].includes(item.status)).length}</strong></div></div>
      </div>
      {error && <div className="inline-error page-error">{error}</div>}
      {current ? (
        <div className="glass-card request-sent">
          <div className="pulse-icon"><Send /></div>
          <span className="eyebrow">{current.status}</span>
          <h2>{current.serviceName ?? "Echipa rutieră"} gestionează cererea</h2>
          <p>{current.problemType}: {current.problemDescription}</p>
          <div className="tracking-line">
            {[0, 1, 2, 3, 4].map((step, index) => (
              <span className="tracking-segment" key={step}>
                <i className={step < statusStep[current.status] ? "done" : step === statusStep[current.status] ? "active" : ""} />
                {index < 4 && <span />}
              </span>
            ))}
          </div>
          <div className="tracking-labels"><b>Trimisă</b><b>Alocată</b><b>În drum</b><b>În lucru</b><b>Finalizată</b></div>
          {current.mediaId && <a className="request-attachment" href={`/api/media/${current.mediaId}/download`}><FileText /> {current.mediaName}</a>}
          <Button onClick={() => setViewingId(null)}>Cerere nouă</Button>
        </div>
      ) : (
        <div className="road-grid">
          <form className="glass-card road-form" onSubmit={submit}>
            <span className="panel-label">DETALII INTERVENȚIE</span><h2>Ce s-a întâmplat?</h2>
            <label><span>Tip problemă</span><select value={problemType} onChange={(event) => setProblemType(event.target.value)}>{problemTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label><span>Descriere</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descrie pe scurt problema și orice detaliu util..." /></label>
            <input ref={fileInput} className="hidden-file-input" type="file" onChange={attach} />
            <span className="field-label">Atașament {media && `· ${media.name}`}</span>
            <div className="media-buttons">
              <button type="button" onClick={() => chooseFile("image/*")}><Camera /> Foto</button>
              <button type="button" onClick={() => chooseFile("video/*")}><Video /> Video</button>
              <button type="button" onClick={() => chooseFile("audio/*")}><Mic /> Audio</button>
            </div>
            <label><span>Service apropiat</span><select value={serviceId ?? ""} onChange={(event) => setServiceId(Number(event.target.value))}>{services.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.rating} ★</option>)}</select></label>
            <Button type="submit" className="danger wide-button" disabled={saving}><LifeBuoy /> {saving ? "Se transmite..." : "Trimite cererea de ajutor"}</Button>
            <small className="privacy-note"><ShieldCheck /> Locația este transmisă doar echipei alocate.</small>
          </form>
          <div className="glass-card location-card">
            <div className="location-map"><ServicesMap items={mapItems} activeId={serviceId ?? undefined} onSelect={(service) => setServiceId(service.id)} /></div>
            <div className="location-info">
              <div><MapPin /><span>LOCAȚIA CURENTĂ</span><strong>{locationState}</strong></div>
              <button onClick={locate}><Crosshair /> Actualizează</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
