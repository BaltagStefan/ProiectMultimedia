import { motion } from "framer-motion";
import { ArrowRight, Car, CheckCircle2, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../shared/components/Button";
import { Loading } from "../../../shared/components/Loading";

export function LoginPage() {
  const auth = useAuth();
  if (!auth.ready) return <Loading />;
  if (auth.authenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="login-page">
      <div className="login-backdrop" />
      <div className="login-grid" />
      <header className="login-header">
        <div className="brand">
          <div className="brand-mark"><Car size={22} /></div>
          <div><strong>AutoAssist</strong><span>3D PLATFORM</span></div>
        </div>
        <div className="secure-label"><ShieldCheck size={16} /> Conexiune securizată</div>
      </header>
      <section className="login-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="login-copy"
        >
          <div className="eyebrow"><Sparkles size={16} /> Inteligență pentru fiecare drum</div>
          <h1>Mașina ta.<br /><span>Mai inteligentă.</span></h1>
          <p>Găsește piese compatibile, programează service-ul și primește ajutor rutier într-o singură platformă.</p>
          <div className="feature-row">
            <span><CheckCircle2 /> Model auto 3D</span>
            <span><CheckCircle2 /> Service-uri verificate</span>
            <span><CheckCircle2 /> Asistență 24/7</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="login-card"
        >
          <div className="login-icon"><KeyRound /></div>
          <span className="overline">BINE AI VENIT</span>
          <h2>Intră în AutoAssist 3D</h2>
          <p>Autentificarea este gestionată în siguranță prin Keycloak.</p>
          <Button onClick={auth.login} className="login-button">
            Autentificare <ArrowRight size={18} />
          </Button>
          <div className="demo-accounts">
            <div><span>UTILIZATOR</span><code>user / user</code></div>
            <div><span>MECANIC</span><code>mecanic / mecanic</code></div>
          </div>
          <small><ShieldCheck size={14} /> Datele de acces sunt criptate și protejate.</small>
        </motion.div>
      </section>
      <footer className="login-footer">AUTOASSIST SYSTEM v1.0 <span /> BUCHAREST NETWORK ONLINE</footer>
    </main>
  );
}

