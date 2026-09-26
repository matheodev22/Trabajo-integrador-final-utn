import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Completá usuario y contraseña");
      return;
    }

    login(username);
    navigate("/chat");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="username">Nombre de usuario</label>

      <input
        id="username"
        type="text"
        placeholder="Ingresá tu usuario"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <label htmlFor="password">Contraseña</label>

      <input
        id="password"
        type="password"
        placeholder="Ingresá tu contraseña"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit" className="login-button">
        Entrar
      </button>
    </form>
  );
}

export default LoginForm;