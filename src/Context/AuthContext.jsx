import { createContext, useContext, useState } from "react";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "../Logic/storageLogic";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
  return getStorageItem("user", null);
});

  const login = (username) => {
    const newUser = {
      username: username,
    };

    setUser(newUser);

    setStorageItem("user", newUser);
  };

  const logout = () => {
    setUser(null);
    removeStorageItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}