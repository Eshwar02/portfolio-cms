import { useEffect, useState } from "react";
import api from "../lib/api";
import { Badge, Button, Card } from "../components/ui";

export default function Messages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/messages/")
      .then((r) => setRows(r.data.results ?? r.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(m) {
    await api.patch(`/messages/${m.id}/`, { read: !m.read });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this message?")) return;
    await api.delete(`/messages/${id}/`);
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Messages</h1>
      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : rows.length === 0 ? (
        <Card className="p-8 text-center text-sm text-neutral-400">No messages yet.</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <Card key={m.id} className={`p-4 ${m.read ? "opacity-70" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-sm text-neutral-500">{m.email}</span>
                    {!m.read && <Badge tone="green">new</Badge>}
                  </div>
                  {m.subject && (
                    <div className="mt-0.5 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      {m.subject}
                    </div>
                  )}
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">
                    {m.body}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Button variant="ghost" className="text-xs" onClick={() => toggleRead(m)}>
                    {m.read ? "Mark unread" : "Mark read"}
                  </Button>
                  <Button variant="danger" className="text-xs" onClick={() => remove(m.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
