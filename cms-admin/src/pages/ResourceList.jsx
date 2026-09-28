import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import { RESOURCES } from "../lib/resources";
import { Badge, Button, Card } from "../components/ui";

export default function ResourceList() {
  const { key } = useParams();
  const cfg = RESOURCES[key];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get(`/${cfg.endpoint}/`)
      .then((r) => setRows(r.data.results ?? r.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function remove(id) {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/${cfg.endpoint}/${id}/`);
    load();
  }

  function cell(row, col) {
    const v = row[col];
    if (col === "status")
      return <Badge tone={v === "published" ? "green" : "amber"}>{v}</Badge>;
    if (typeof v === "boolean")
      return v ? <Badge tone="accent">Yes</Badge> : <span className="text-[var(--muted)]">No</span>;
    return <span className="text-[var(--ink)]">{String(v ?? "—")}</span>;
  }

  return (
    <div className="animate-rise">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="display text-2xl font-semibold">{cfg.label}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {loading ? "Loading…" : `${rows.length} item${rows.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link to={`/r/${key}/new`}>
          <Button>+ New {cfg.label.replace(/s$/, "")}</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b hairline text-left text-[11px] uppercase tracking-widest text-[var(--muted)]">
              {cfg.columns.map((c) => (
                <th key={c} className="px-5 py-3 font-medium">
                  {c.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-5 py-12 text-center text-[var(--muted)]">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-5 py-14 text-center">
                  <p className="text-[var(--muted)]">No {cfg.label.toLowerCase()} yet.</p>
                  <Link to={`/r/${key}/new`} className="mt-3 inline-block">
                    <Button variant="subtle">Create the first one</Button>
                  </Link>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const id = row[cfg.idKey];
                return (
                  <tr
                    key={id}
                    className="group border-b hairline transition-colors last:border-0 hover:bg-[var(--panel-2)]"
                  >
                    {cfg.columns.map((c) => (
                      <td key={c} className="px-5 py-3.5">
                        {cell(row, c)}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2 opacity-70 transition-opacity group-hover:opacity-100">
                        <Link to={`/r/${key}/${id}`}>
                          <Button variant="ghost" className="px-2.5 py-1 text-xs">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          className="px-2.5 py-1 text-xs"
                          onClick={() => remove(id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
