import { useContext } from "react";
import AuthContext from "../contexts/auth.context.jsx";
import { login, logout, register, verifyEmail } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, authLoading } = context;

    const handleLogin = async (identifier, password) => {
        try {
            const data = await login(identifier, password);
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);

            return { success: true, message: data.message };

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Unable to login"
            }
        }
    }

    const handleRegister = async (email, username, password) => {
        try {
            const data = await register(email, username, password);
            return {
                success: true,
                message: data.message
            }

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Unable to signup"
            }
        }
    }

    const handleVerifyEmail = async (email, otp) => {
        try {
            const data = await verifyEmail(email, otp);

            return { success: true, message: data.message };

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in email verification!"
            }
        }
    }

    const handleLogout = async () => {
        try {
            const data = await logout();
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in logout!"
            }
        }
        finally {
            setUser(null);
            localStorage.removeItem("accessToken");
        }
    }

    // const handleGetme = async () => {
    //     setLoading(true);
    //     try {
    //         const accessToken = localStorage.getItem("accessToken");
    //         if (!accessToken) {
    //             setUser(null);
    //             return;
    //         }

    //         const data = await getMe(accessToken);
    //         setUser(data.user);

    //     } catch (error) {
    //         setUser(null);
    //         console.log("Failed to get user: ", error.response?.data?.message || error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return { user, loading, authLoading, handleRegister, handleVerifyEmail, handleLogin, handleLogout };
}