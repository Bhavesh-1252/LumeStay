import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading, authLoading, setAuthLoading } = context;

    const handleLogin = async (identifier, password) => {
        setLoading(true);
        try {
            const data = await login(identifier, password);
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);

        } catch (error) {

        } finally {
            setLoading(false);
        }

    }

    const handleRegister = async (email, username, password) => {
        setLoading(true);
        try {
            const data = await register(email, username, password);
            setUser(data.user);
        } catch (error) {

        } finally {
            setLoading(false);
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

    const handleGetme = async () => {
        setLoading(true);
        try {
            await getMe();

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return { user, loading, authLoading, handleRegister, handleLogin, handleLogout };
}