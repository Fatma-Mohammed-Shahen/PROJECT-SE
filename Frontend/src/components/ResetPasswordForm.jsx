import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Add this
import axios from "axios";

export default function ResetPasswordForm() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ← Hook for navigation

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/v1/resetPasswordWithOtp", form);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <form onSubmit={handleReset} className="max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-semibold">Reset Password with OTP</h2>
      
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 w-full"
        value={form.otp}
        onChange={(e) => setForm({ ...form, otp: e.target.value })}
      />
      <input
        type="password"
        placeholder="New Password"
        className="border p-2 w-full"
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Login
        </button>
      </div>

      {message && <p className="text-red-600">{message}</p>}
    </form>
  );
}
