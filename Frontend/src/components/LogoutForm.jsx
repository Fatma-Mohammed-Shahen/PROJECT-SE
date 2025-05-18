// components/LogoutForm.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

const LogoutForm = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("http://localhost:5000/api/v1/logout", {}, {
          withCredentials: true,
        });
        setUser(null);
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        navigate("/login"); // Still redirect to login
      }
    };

    logout();
  }, [setUser, navigate]);

  return <p>Logging out...</p>;
};

export default LogoutForm;
