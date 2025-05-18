import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LogoutForm from "./components/LogoutForm"; // adjust path as needed


import ProtectedRoute from "./auth/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";

function App() {


  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />


        {/* Protected Routes with Layout and Nested Children */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "organizer"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Index Route */}
          <Route index element={<Dashboard />} />

        
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/logout" element={<LogoutForm />} />


        {/* Wildcard Route */}
        <Route
          path="*"
          element={<Navigate to={"/login"} replace />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
