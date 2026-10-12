import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const getAndSetUser = async () => {
      try {
        const data = await getMe(accessToken);
        setUser(data.user);
      } catch (error) {

      }
      finally{
        setAuthLoading(false);
      }
    }

    getAndSetUser();
  }, [])


  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, authLoading, setAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
