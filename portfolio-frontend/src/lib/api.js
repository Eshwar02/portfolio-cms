import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

// Public site: read-only, no auth needed. The backend returns published rows only.
const api = axios.create({ baseURL: API_BASE });

export const ORIGIN = API_BASE.replace(/\/api\/?$/, "");

// Resolve a media path returned by the API to an absolute URL.
export function mediaUrl(path) {
  if (!path) return null;
  return path.startsWith("http") ? path : ORIGIN + path;
}

// Fetch a list endpoint, tolerating both paginated and plain-array responses.
export async function fetchList(resource) {
  const { data } = await api.get(`/${resource}/`);
  return data.results ?? data;
}

export default api;
