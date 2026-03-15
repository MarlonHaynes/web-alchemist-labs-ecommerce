import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import {
  loginUser as loginUserService,
  logoutUser as logoutUserService,
  registerUser as registerUserService,
} from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function register(email, password) {
    return await registerUserService(email, password);
  }

  async function login(email, password) {
    return await loginUserService(email, password);
  }

  async function logout() {
    await logoutUserService();
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthLoading,
        register,
        login,
        logout,
        isAuthenticated: Boolean(currentUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}