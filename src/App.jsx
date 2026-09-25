import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Chat from "./Pages/Chat";
import { useAuth } from "./Context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">⚠️</div>

        <h1>404</h1>

        <h2>Página no encontrada</h2>

        <p>
          La dirección que intentaste visitar no existe.
        </p>

        <a href="/" className="back-home-button">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;