import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import useFlashMessage from "../../../hooks/useFlashMessage";

const Listings = () => {
  const [loading, setLoading] = useState("");

  const { handleLogout } = useAuth();
  const { showFlash } = useFlashMessage();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await handleLogout();
      showFlash(
        response.success ? response.message : "Logged out from this device",
        response.success ? "success" : "info",
      );
    } finally {
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Listings;
