import { ArrowLeft, CalendarPlus, CheckCircle2, MessageSquareText, Settings2, ShieldCheck, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../shared/components/Badge";
import { parts } from "../../../shared/data/mockData";

export function PartDetailsPage() {
  const { id } = useParams();
  const part = parts.find((item) => item.id === Number(id)) ?? parts[0];
  const installationUrl = `/programari?mode=installation&partId=${part.id}&partName=${encodeURIComponent(part.name)}&serviceName=${encodeURIComponent("AutoTech Nord")}`;

  return (
    <>
      <Link className="back-link" to="/piese"><ArrowLeft /> Înapoi la catalog</Link>
      <div className="part-details">
        <div className="glass-card part-detail-visual"><Settings2 /><div className="scan-ring" /></div>
        <div className="part-detail-copy">
          <Badge>COMPATIBILITATE CONFIRMATĂ</Badge><h1>{part.name}</h1><p>{part.description}</p>
          <div className="compatibility-box"><CheckCircle2 /><div><strong>{part.compatibility}</strong><span>Potrivire verificată pentru mașina selectată</span></div></div>
          <strong className="detail-price">{part.price} <small>lei</small></strong>
          <div className="stock-line"><span className="status-dot" /> {part.stock} bucăți disponibile · Livrare 24-48h</div>
          <div className="detail-actions">
            <Link className="button" to={installationUrl}><CalendarPlus /> Programează montaj</Link>
            <Link className="button secondary" to="/chat"><MessageSquareText /> Chat service</Link>
          </div>
          <div className="benefits"><span><ShieldCheck /> Garanție 24 luni</span><span><Truck /> Livrare rapidă</span><span><CheckCircle2 /> Montaj autorizat</span></div>
        </div>
      </div>
      <div className="glass-card service-offer">
        <div><span>SERVICE RECOMANDAT</span><h3>AutoTech Nord</h3><p>Montaj disponibil · 4.8 rating</p></div>
        <strong>Manoperă de la 120 lei</strong>
        <Link className="button small" to="/service-uri/1">Vezi service</Link>
      </div>
    </>
  );
}
