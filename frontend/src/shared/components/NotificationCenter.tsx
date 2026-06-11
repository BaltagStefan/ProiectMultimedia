import { Bell, CheckCheck, MessageSquareText, Wrench } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { NotificationView, UnreadSummary } from "../services/workflows";

export function NotificationCenter({
  mechanic,
  onSummary,
}: {
  mechanic: boolean;
  onSummary: (summary: UnreadSummary) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationView[]>([]);
  const [summary, setSummary] = useState<UnreadSummary>({ messages: 0, notifications: 0, total: 0 });
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      const [notifications, unread] = await Promise.all([
        api.get<NotificationView[]>("/notifications"),
        api.get<UnreadSummary>("/notifications/unread"),
      ]);
      setItems(notifications.data);
      setSummary(unread.data);
      onSummary(unread.data);
    } catch {
      // The next polling cycle retries while backend services are starting.
    }
  }, [onSummary]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(refresh, 8_000);
    const listener = () => void refresh();
    window.addEventListener("autoassist:notifications", listener);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("autoassist:notifications", listener);
    };
  }, [refresh]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const destination = (item: NotificationView) => {
    if (item.entityType === "CONVERSATION") return `/chat?conversation=${item.entityId}`;
    if (item.entityType === "ROAD_ASSISTANCE") return mechanic ? "/mecanic/asistenta" : "/asistenta";
    if (item.entityType === "APPOINTMENT") return mechanic ? "/mecanic/programari" : "/programari";
    return "/dashboard";
  };

  const openItem = async (item: NotificationView) => {
    if (!item.read) await api.put(`/notifications/${item.id}/read`);
    setOpen(false);
    await refresh();
    navigate(destination(item));
  };

  const readAll = async () => {
    await api.put("/notifications/read-all");
    await refresh();
  };

  return (
    <div className="notification-center" ref={root}>
      <button className="notification-trigger" onClick={() => setOpen((value) => !value)} aria-label="Notificări">
        <Bell />
        {summary.total > 0 && <b>{summary.total > 99 ? "99+" : summary.total}</b>}
      </button>
      {open && (
        <div className="notification-popover glass-card">
          <header>
            <div><span>CENTRU ACTIVITATE</span><h3>Notificări</h3></div>
            <button onClick={readAll} disabled={!summary.notifications}><CheckCheck /> Citește tot</button>
          </header>
          {items.length === 0 ? (
            <div className="notification-empty"><Bell /><p>Nu ai notificări.</p></div>
          ) : (
            <div className="notification-list">
              {items.map((item) => (
                <button key={item.id} className={item.read ? "notification-item" : "notification-item unread"} onClick={() => void openItem(item)}>
                  <i>{item.type === "CHAT" ? <MessageSquareText /> : <Wrench />}</i>
                  <div><b>{item.title}</b><p>{item.message}</p><span>{new Date(item.createdAt).toLocaleString("ro-RO")}</span></div>
                  {!item.read && <em />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
