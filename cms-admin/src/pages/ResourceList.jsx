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
    if (typeof v === "boolean") return v ? "Yes" : "No";
    return String(v ?? "—");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{cfg.label}</h1>
          <p className="text-sm text-neutral-500">{rows.length} item(s)</p>
        </div>
        <Link to={`/r/${key}/new`}>
          <Button>+ New</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b hairline text-left text-xs uppercase tracking-wider text-neutral-400">
              {cfg.columns.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c.replace("_", " ")}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-4 py-8 text-center text-neutral-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-4 py-8 text-center text-neutral-400">
                  No items yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const id = row[cfg.idKey];
                return (
                  <tr key={id} className="border-b hairline last:border-0">
                    {cfg.columns.map((c) => (
                      <td key={c} className="px-4 py-3">
                        {cell(row, c)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
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
