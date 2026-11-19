import { useEffect, useState } from "react";
import AuthContext from "../contexts/auth.context";
import { getMe } from "../services/auth.api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // const handleRotateTokens = async () => {
  //   try {
  //     const data = await rotateTokens();
  //     localStorage.setItem("accessToken", data.accessToken);

  //     return { success: true, accessToken: data.accessToken };
  //   } catch (error) {
  //     localStorage.removeItem("accessToken");
  //     return {
  //       success: false,
  //       message:
  //         error.response?.data?.message || error.message || "Session expired!",
  //     };
  //   }
  // };

  // Initial load - getting user from accessToken
  // if accessToken is expired then rotating token with refreshToken
  // if refreshToken is expired then user have to re-login
  const handleGetme = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const initialState = async () => {
      await handleGetme();
    };

    initialState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        setAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
