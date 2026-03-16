import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import {
  loginUser as loginUserService,
  logoutUser as logoutUserService,
  registerUser as registerUserService,
} from "../services/authService";
import { createUserProfile, getUserProfile } from "../services/userService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setUserProfile(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        let profile = await getUserProfile(user.uid);

        if (!profile) {
          await createUserProfile(user);
          profile = await getUserProfile(user.uid);
        }

        setUserProfile(profile);
      } catch (error) {
        console.error("Error loading user profile:", error);

        setUserProfile({
          uid: user.uid,
          email: user.email,
          role: "customer",
        });
      } finally {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function register(email, password) {
    const user = await registerUserService(email, password);
    await createUserProfile(user);

    let profile = null;

    try {
      profile = await getUserProfile(user.uid);
    } catch (error) {
      console.error("Error loading profile after register:", error);
      profile = {
        uid: user.uid,
        email: user.email,
        role: "customer",
      };
    }

    setUserProfile(profile);
    return user;
  }

  async function login(email, password) {
    const user = await loginUserService(email, password);

    let profile = null;

    try {
      profile = await getUserProfile(user.uid);

      if (!profile) {
        await createUserProfile(user);
        profile = await getUserProfile(user.uid);
      }
    } catch (error) {
      console.error("Error loading profile after login:", error);
      profile = {
        uid: user.uid,
        email: user.email,
        role: "customer",
      };
    }

    setUserProfile(profile);
    return user;
  }

  async function logout() {
    await logoutUserService();
    setUserProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAuthLoading,
        register,
        login,
        logout,
        isAuthenticated: Boolean(currentUser),
        isAdmin: userProfile?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}