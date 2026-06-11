import { FileText, Paperclip, Phone, Search, Send, ShieldCheck } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { api } from "../../../shared/services/api";
import {
  AutoServiceView,
  ConversationView,
  errorMessage,
  MessageView,
  uploadMedia,
} from "../../../shared/services/workflows";

export function ChatPage() {
  const auth = useAuth();
  const mechanic = auth.roles.includes("MECHANIC") || auth.roles.includes("ADMIN");
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationView[]>([]);
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [services, setServices] = useState<AutoServiceView[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await api.get<ConversationView[]>("/conversations");
      setConversations(response.data);
      const requested = Number(searchParams.get("conversation"));
      setSelectedId((current) => {
        if (requested && response.data.some((item) => item.id === requested)) return requested;
        if (current && response.data.some((item) => item.id === current)) return current;
        return response.data[0]?.id ?? null;
      });
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, [searchParams]);

  const loadMessages = useCallback(async (conversationId: number) => {
    try {
      const response = await api.get<MessageView[]>(`/conversations/${conversationId}/messages`);
      setMessages(response.data);
      await api.put(`/conversations/${conversationId}/read`);
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    void loadConversations();
    if (!mechanic) {
      api.get<AutoServiceView[]>("/services").then((response) => {
        const available = response.data.filter((item) => item.type !== "RAR_ITP_MOCK");
        setServices(available);
        setServiceId(available[0]?.id ?? null);
      }).catch((requestError) => setError(errorMessage(requestError)));
    }
    const timer = window.setInterval(loadConversations, 6_000);
    return () => window.clearInterval(timer);
  }, [loadConversations, mechanic]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    void loadMessages(selectedId);
    const timer = window.setInterval(() => void loadMessages(selectedId), 4_000);
    return () => window.clearInterval(timer);
  }, [loadMessages, selectedId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selected = conversations.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(() => conversations.filter((item) => {
    const name = mechanic ? item.userName : item.serviceName;
    return (name ?? "").toLowerCase().includes(search.toLowerCase());
  }), [conversations, mechanic, search]);
  const sharedFiles = messages.filter((message) => message.mediaId);

  const selectConversation = (id: number) => {
    setSelectedId(id);
    setSearchParams({ conversation: String(id) });
  };

  const startConversation = async () => {
    if (!serviceId) return;
    try {
      const response = await api.post<ConversationView>("/conversations", { serviceId });
      await loadConversations();
      selectConversation(response.data.id);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const send = async (mediaId?: number, mediaName?: string) => {
    if (!selectedId || (!text.trim() && !mediaId) || sending) return;
    setSending(true);
    setError("");
    try {
      await api.post(`/conversations/${selectedId}/messages`, {
        content: text.trim() || mediaName || null,
        messageType: mediaId ? "FILE" : "TEXT",
        mediaId: mediaId ?? null,
      });
      setText("");
      await Promise.all([loadMessages(selectedId), loadConversations()]);
      window.dispatchEvent(new Event("autoassist:notifications"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  const attach = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setSending(true);
    try {
      const media = await uploadMedia(file);
      setSending(false);
      await send(media.id, media.originalFileName);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setSending(false);
    }
  };

  const counterpart = selected ? (mechanic ? selected.userName : selected.serviceName) : null;

  return (
    <div className="chat-shell glass-card">
      <aside className="conversations">
        <div className="chat-title"><div><span>MESAGERIE</span><h2>Conversații</h2></div><b>{conversations.reduce((sum, item) => sum + item.unreadCount, 0)}</b></div>
        <label className="search-field"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Caută..." /></label>
        {!mechanic && (
          <div className="new-conversation">
            <select value={serviceId ?? ""} onChange={(event) => setServiceId(Number(event.target.value))}>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
            <button onClick={() => void startConversation()}>Conversație nouă</button>
          </div>
        )}
        <div className="conversation-list">
          {filtered.map((item) => {
            const name = mechanic ? item.userName : item.serviceName;
            return (
              <button className={selectedId === item.id ? "conversation active" : "conversation"} key={item.id} onClick={() => selectConversation(item.id)}>
                <div className="avatar service-avatar">{(name ?? "?").slice(0, 1).toUpperCase()}</div>
                <div><strong>{name ?? "Conversație"}</strong><p>{item.lastMessage ?? "Nicio conversație începută"}</p></div>
                <span>{item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : ""}{item.unreadCount > 0 && <i>{item.unreadCount}</i>}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="message-area">
        {selected ? (
          <>
            <header className="chat-header">
              <div className="avatar service-avatar">{(counterpart ?? "?").slice(0, 1).toUpperCase()}</div>
              <div><strong>{counterpart}</strong><span><i /> Conversație securizată</span></div>
              {selected.servicePhone && <a className="chat-action" href={`tel:${selected.servicePhone}`} title="Apelează service-ul"><Phone /></a>}
            </header>
            <div className="messages">
              <div className="day-divider"><span>MESAJE</span></div>
              {messages.map((message) => (
                <div className={message.mine ? "message mine" : "message"} key={message.id}>
                  {!message.mine && <b className="message-sender">{message.senderName ?? (message.senderRole === "MECHANIC" ? "Mecanic" : "Utilizator")}</b>}
                  {message.content && <p>{message.content}</p>}
                  {message.mediaId && <a className="message-file" href={`/api/media/${message.mediaId}/download`}><FileText /> {message.mediaName ?? "Descarcă atașamentul"}</a>}
                  <span>{new Date(message.createdAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
              <div ref={messagesEnd} />
            </div>
            {error && <div className="inline-error">{error}</div>}
            <div className="message-input">
              <input ref={fileInput} className="hidden-file-input" type="file" onChange={attach} />
              <button onClick={() => fileInput.current?.click()} disabled={sending} title="Atașează fișier"><Paperclip /></button>
              <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void send()} placeholder="Scrie un mesaj..." />
              <button className="send-button" onClick={() => void send()} disabled={sending || !text.trim()}><Send /></button>
            </div>
          </>
        ) : (
          <div className="chat-empty"><Send /><h2>Selectează o conversație</h2><p>{mechanic ? "Conversațiile utilizatorilor vor apărea aici." : "Alege un service și pornește o conversație."}</p></div>
        )}
      </section>

      <aside className="chat-details">
        <div className="large-service-avatar">{(counterpart ?? "?").slice(0, 1).toUpperCase()}</div>
        <h3>{counterpart ?? "Mesagerie AutoAssist"}</h3>
        <span className="verified"><ShieldCheck /> Identitate verificată</span>
        <div className="chat-service-stats">
          <div><span>Mesaje</span><b>{messages.length}</b></div>
          <div><span>Necitite</span><b>{selected?.unreadCount ?? 0}</b></div>
        </div>
        <span className="panel-label">FIȘIERE PARTAJATE</span>
        {sharedFiles.length === 0 && <p className="no-shared-files">Nu există fișiere.</p>}
        {sharedFiles.map((message) => (
          <a className="shared-file" href={`/api/media/${message.mediaId}/download`} key={message.id}>
            <FileText /><div><b>{message.mediaName ?? "Atașament"}</b><span>{message.senderName}</span></div>
          </a>
        ))}
      </aside>
    </div>
  );
}
