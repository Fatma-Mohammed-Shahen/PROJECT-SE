import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put("/api/v1/forgetPassword", { email });
    alert("Check your email for password reset instructions.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
