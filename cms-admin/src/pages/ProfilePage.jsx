import { useEffect, useState } from "react";
import api from "../lib/api";
import { Button, Card, Input, Textarea } from "../components/ui";

const FIELDS = [
  { name: "name", label: "Name", type: "text" },
  { name: "title", label: "Title / role", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "location", label: "Location", type: "text" },
];

export default function ProfilePage() {
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/profile/").then((r) => setValues(r.data || {}));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      FIELDS.forEach((f) => fd.append(f.name, values[f.name] ?? ""));
      if (files.profile_image) fd.append("profile_image", files.profile_image);
      if (files.resume) fd.append("resume", files.resume);
      const { data } = await api.put("/profile/", fd);
      setValues(data);
      setMsg("Saved.");
    } catch {
      setMsg("Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Profile</h1>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <Textarea
                  rows={4}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                />
              ) : (
                <Input
                  type={f.type}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Profile image
            </label>
            <input
              type="file"
              onChange={(e) => setFiles((s) => ({ ...s, profile_image: e.target.files[0] }))}
              className="block w-full text-sm text-neutral-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Resume</label>
            <input
              type="file"
              onChange={(e) => setFiles((s) => ({ ...s, resume: e.target.files[0] }))}
              className="block w-full text-sm text-neutral-500"
            />
          </div>
          {msg && <p className="text-sm text-neutral-500">{msg}</p>}
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
