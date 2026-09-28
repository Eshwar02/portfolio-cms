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

  const tiles = [
    ...RESOURCE_KEYS.map((key) => ({
      to: `/r/${key}`,
      label: RESOURCES[key].label,
      value: counts[key],
    })),
    { to: "/messages", label: "Messages", value: messages, accent: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Everything in your portfolio at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:[box-shadow:0_8px_24px_-8px_rgb(0_0_0_/_0.18)]">
              <div
                className={`absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100 ${
                  t.accent ? "scale-x-100" : ""
                }`}
              />
              <div className="text-3xl font-semibold tabular-nums tracking-tight">
                {t.value ?? "—"}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>{t.label}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
