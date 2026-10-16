import { createContext, useEffect, useState } from "react";
import { getMe, rotateTokens } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const handleRotateTokens = async () => {
    try {
      const data = await rotateTokens();
      if (!data.success) {
        throw new Error(data.message || "Session Expired!");
      }

      localStorage.setItem("accessToken", data.accessToken);

      return { success: true, accessToken: data.accessToken };
    } catch (error) {
      localStorage.removeItem("accessToken");
      return { success: false };
    }
  }

  // Initial load - getting user from accessToken
  // if accessToken is expired then rotating token with refreshToken
  // if refreshToken is expired then user have to re-login
  const handleGetme = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        const data = await getMe(accessToken);
        setUser(data.user);

      } catch (error) { // If accessToken is invalid
        if (error.response?.status !== 401) throw error;

        const result = await handleRotateTokens(); // rotating tokens
        if (!result.success) {
          setUser(null);
          return;
        }

        const data = await getMe(result.accessToken);
        setUser(data.user);
        console.log()
      }
    } catch (error) {
      setUser(null);
      console.log("Failed to get user:", error.message);
    }
    finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    const initialState = async () => {
      await handleGetme();
    }

    initialState()
  }, [])


  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, authLoading, setAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
