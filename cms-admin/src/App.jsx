import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/ResourceList";
import ResourceForm from "./pages/ResourceForm";
import ProfilePage from "./pages/ProfilePage";
import MediaPage from "./pages/MediaPage";
import Messages from "./pages/Messages";

function RequireAuth({ children }) {
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="r/:key" element={<ResourceList />} />
        <Route path="r/:key/new" element={<ResourceForm />} />
        <Route path="r/:key/:id" element={<ResourceForm />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="messages" element={<Messages />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
