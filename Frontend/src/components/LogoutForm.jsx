import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

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
        toast.success("You have been logged out.");
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        toast.error("Logout failed. Please try again.");
        navigate("/login");
      }
    };

    logout();
  }, [setUser, navigate]);

  return <p>Logging out...</p>;
};

export default LogoutForm;
