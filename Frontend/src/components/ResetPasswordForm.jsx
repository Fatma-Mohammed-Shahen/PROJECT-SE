import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPasswordForm() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/v1/resetPasswordWithOtp", form);
      toast.success(res.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password.");
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
        required
      />
      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 w-full"
        value={form.otp}
        onChange={(e) => setForm({ ...form, otp: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        className="border p-2 w-full"
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        required
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
    </form>
  );
}
