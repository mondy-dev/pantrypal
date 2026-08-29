import { useState } from "react";
import * as authService from "../services/authService";
import { AuthContext } from "./AuthContextObject";

function getInitialUser() {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (token && savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const loggedInUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    const registeredUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(registeredUser));
    setUser(registeredUser);

    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
