import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { RESOURCE_KEYS, RESOURCES } from "../lib/resources";
import { Card } from "../components/ui";

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [messages, setMessages] = useState(0);

  useEffect(() => {
    RESOURCE_KEYS.forEach((key) => {
      api
        .get(`/${RESOURCES[key].endpoint}/`)
        .then((r) =>
          setCounts((c) => ({ ...c, [key]: r.data.count ?? r.data.length ?? 0 }))
        )
        .catch(() => {});
    });
    api
      .get("/messages/")
      .then((r) => setMessages(r.data.count ?? r.data.length ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mb-6 text-sm text-neutral-500">Overview of your portfolio content.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {RESOURCE_KEYS.map((key) => (
          <Link key={key} to={`/r/${key}`}>
            <Card className="p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <div className="text-2xl font-semibold">{counts[key] ?? "—"}</div>
              <div className="mt-1 text-sm text-neutral-500">{RESOURCES[key].label}</div>
            </Card>
          </Link>
        ))}
        <Link to="/messages">
          <Card className="p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
            <div className="text-2xl font-semibold">{messages}</div>
            <div className="mt-1 text-sm text-neutral-500">Messages</div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
