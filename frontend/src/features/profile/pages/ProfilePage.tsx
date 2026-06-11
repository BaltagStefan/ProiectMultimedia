import { Car, KeyRound, Mail, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { Button } from "../../../shared/components/Button";

export function ProfilePage() {
  const auth = useAuth();
  const mechanic = auth.roles.includes("MECHANIC");
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">IDENTITATE AUTOASSIST</span><h1>{mechanic ? "Profil service" : "Profilul meu"}</h1><p>Informații sincronizate cu identitatea Keycloak.</p></div><Button><Save /> Salvează modificările</Button></div>
      <div className="profile-grid">
        <aside className="glass-card profile-summary"><div className="profile-avatar">{auth.username.slice(0, 1).toUpperCase()}</div><h2>{auth.username}</h2><span className="verified"><ShieldCheck /> Cont verificat</span><div><span>ROL ACTIV</span><b>{mechanic ? "MECANIC" : "UTILIZATOR"}</b></div><div><span>MEMBRU DIN</span><b>IUNIE 2026</b></div></aside>
        <section className="glass-card profile-form"><span className="panel-label">DATE PERSONALE</span><div className="field-grid"><label><span><UserRound /> Utilizator</span><input value={auth.username} readOnly /></label><label><span><Mail /> E-mail</span><input value={`${auth.username}@autoassist.local`} readOnly /></label><label><span><Car /> Vehicul principal</span><input value={mechanic ? "AutoTech Nord" : "Volkswagen Golf 7"} readOnly /></label><label><span><KeyRound /> Securitate</span><input value="Gestionată prin Keycloak" readOnly /></label></div><div className="security-box"><ShieldCheck /><div><b>Autentificare securizată</b><p>Parola și sesiunile sunt administrate centralizat de Keycloak.</p></div><button className="button secondary">Gestionează contul</button></div></section>
      </div>
    </>
  );
}

