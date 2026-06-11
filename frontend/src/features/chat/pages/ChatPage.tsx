import { FileText, Image, MoreVertical, Paperclip, Phone, Search, Send, ShieldCheck, Video } from "lucide-react";
import { useState } from "react";

const conversations = [
  ["AutoTech Nord", "Programarea a fost confirmată.", "2m", true],
  ["RoadHelp 24", "Echipa este în drum spre tine.", "18m", false],
  ["Garage Performance", "Am verificat seria piesei.", "1h", false],
];

export function ChatPage() {
  const [messages, setMessages] = useState([
    { mine: false, text: "Salut! Cu ce te putem ajuta astăzi?", time: "10:24" },
    { mine: true, text: "Bună! Aș vrea să confirm dacă bateria Bosch este compatibilă cu Golf 7 1.6 TDI.", time: "10:26" },
    { mine: false, text: "Da, modelul de 70Ah este compatibil. Avem 4 bucăți în stoc și putem face montajul mâine.", time: "10:28" },
  ]);
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { mine: true, text, time: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
  };
  return (
    <div className="chat-shell glass-card">
      <aside className="conversations">
        <div className="chat-title"><div><span>MESAGERIE</span><h2>Conversații</h2></div><b>3</b></div>
        <label className="search-field"><Search /><input placeholder="Caută..." /></label>
        {conversations.map((item, index) => <button className={index === 0 ? "conversation active" : "conversation"} key={String(item[0])}><div className="avatar service-avatar">{String(item[0]).slice(0, 1)}</div><div><strong>{item[0]}</strong><p>{item[1]}</p></div><span>{item[2]}{item[3] && <i />}</span></button>)}
      </aside>
      <section className="message-area">
        <header className="chat-header"><div className="avatar service-avatar">A</div><div><strong>AutoTech Nord</strong><span><i /> Online · răspunde rapid</span></div><button><Phone /></button><button><Video /></button><button><MoreVertical /></button></header>
        <div className="messages"><div className="day-divider"><span>ASTĂZI</span></div>{messages.map((message, index) => <div className={message.mine ? "message mine" : "message"} key={index}><p>{message.text}</p><span>{message.time}</span></div>)}</div>
        <div className="message-input"><button><Paperclip /></button><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Scrie un mesaj..." /><button><Image /></button><button className="send-button" onClick={send}><Send /></button></div>
      </section>
      <aside className="chat-details"><div className="large-service-avatar">A</div><h3>AutoTech Nord</h3><span className="verified"><ShieldCheck /> Partener verificat</span><div className="chat-service-stats"><div><span>Rating</span><b>4.8 / 5</b></div><div><span>Timp răspuns</span><b>~ 5 min</b></div></div><span className="panel-label">FIȘIERE PARTAJATE</span><div className="shared-file"><FileText /><div><b>oferta_baterie.pdf</b><span>320 KB</span></div></div><div className="shared-file"><Image /><div><b>serie_baterie.jpg</b><span>1.2 MB</span></div></div></aside>
    </div>
  );
}

