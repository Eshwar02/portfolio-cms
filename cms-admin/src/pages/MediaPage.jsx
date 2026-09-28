import { useState } from "react";
import api from "../lib/api";
import { API_BASE } from "../lib/api";
import { Button, Card, Input } from "../components/ui";

export default function MediaPage() {
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const origin = API_BASE.replace(/\/api\/?$/, "");

  async function upload(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("alt_text", alt);
      const { data } = await api.post("/upload/", fd);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.file?.[0] || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const url = result?.file
    ? result.file.startsWith("http")
      ? result.file
      : origin + result.file
    : null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Media Upload</h1>
      <Card className="p-6">
        <form onSubmit={upload} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              File (image or PDF, max 5 MB)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-neutral-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Alt text
            </label>
            <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" disabled={busy}>
            {busy ? "Uploading…" : "Upload"}
          </Button>
        </form>

        {url && (
          <div className="mt-6 border-t hairline pt-4">
            <p className="mb-2 text-xs font-medium text-neutral-500">Uploaded URL</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm text-blue-600 underline dark:text-blue-400"
            >
              {url}
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
