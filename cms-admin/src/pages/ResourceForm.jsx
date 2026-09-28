import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { RESOURCES } from "../lib/resources";
import { Button, Card, Input, Select, Textarea } from "../components/ui";

export default function ResourceForm() {
  const { key, id } = useParams();
  const cfg = RESOURCES[key];
  const isNew = id === undefined || id === "new";
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/${cfg.endpoint}/${id}/`).then((r) => setValues(r.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, id]);

  function set(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  const hasFiles = Object.values(files).some(Boolean);

  function buildPayload() {
    if (hasFiles) {
      const fd = new FormData();
      cfg.fields.forEach((f) => {
        if (f.type === "file") {
          if (files[f.name]) fd.append(f.name, files[f.name]);
        } else if (values[f.name] !== undefined && values[f.name] !== null) {
          fd.append(f.name, values[f.name]);
        }
      });
      return fd;
    }
    // JSON: drop file keys (untouched) so we don't send URL strings back.
    const body = {};
    cfg.fields.forEach((f) => {
      if (f.type === "file") return;
      if (values[f.name] !== undefined) body[f.name] = values[f.name];
    });
    return body;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = buildPayload();
      if (isNew) {
        await api.post(`/${cfg.endpoint}/`, payload);
      } else {
        await api.patch(`/${cfg.endpoint}/${id}/`, payload);
      }
      navigate(`/r/${key}`);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("  ") : "Save failed."
      );
    } finally {
      setBusy(false);
    }
  }

  function field(f) {
    const common = {
      value: values[f.name] ?? "",
      onChange: (e) => set(f.name, e.target.value),
      required: f.required,
    };
    switch (f.type) {
      case "textarea":
        return <Textarea rows={f.name === "body" ? 8 : 3} {...common} />;
      case "select":
        return (
          <Select
            options={f.options}
            value={values[f.name] ?? f.options[0]}
            onChange={(e) => set(f.name, e.target.value)}
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!values[f.name]}
            onChange={(e) => set(f.name, e.target.checked)}
            className="h-4 w-4"
          />
        );
      case "file":
        return (
          <div className="space-y-1">
            {values[f.name] && typeof values[f.name] === "string" && (
              <a
                href={values[f.name]}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 underline dark:text-blue-400"
              >
                current file
              </a>
            )}
            <input
              type="file"
              onChange={(e) => setFiles((s) => ({ ...s, [f.name]: e.target.files[0] }))}
              className="block w-full text-sm text-neutral-500 file:mr-3 file:rounded-md file:border file:border-neutral-300 file:bg-transparent file:px-3 file:py-1.5 file:text-sm dark:file:border-neutral-700"
            />
          </div>
        );
      case "number":
        return (
          <Input
            type="number"
            value={values[f.name] ?? ""}
            onChange={(e) => set(f.name, e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={values[f.name] ?? ""}
            onChange={(e) => set(f.name, e.target.value)}
            required={f.required}
          />
        );
      default:
        return <Input type={f.type === "url" ? "url" : "text"} {...common} />;
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">
        {isNew ? `New ${cfg.label}` : `Edit ${cfg.label}`}
      </h1>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          {cfg.fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                {f.label}
                {f.required && <span className="text-red-500"> *</span>}
              </label>
              {field(f)}
            </div>
          ))}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate(`/r/${key}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
