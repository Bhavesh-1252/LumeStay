import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { getMe, login, logout, register, verifyEmail } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading, authLoading, setAuthLoading } = context;

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

            if (!data.success) {
                throw new Error(data.message || "Signup failed!")
            }

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
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {

        } finally {
            setLoading(false);
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