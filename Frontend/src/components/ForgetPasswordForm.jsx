import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForget = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/v1/forgetPassword", { email });
      setMessage(res.data.message);
      setTimeout(() => navigate("/reset-password"), 2000); // Navigate to OTP page after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleForget} className="max-w-sm mx-auto mt-20 space-y-4">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Send OTP
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
