import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/global.css";
import "./styles/ChatList.css";
import "./styles/ChatWindow.css";
import "./styles/Contacts.css";
import "./styles/Status.css";
import "./styles/Profile.css";
import "./styles/Settings.css";
import "./styles/mediaqueries.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);