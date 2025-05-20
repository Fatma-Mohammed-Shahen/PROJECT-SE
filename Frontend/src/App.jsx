import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LogoutForm from "./components/LogoutForm"; // adjust path as needed
import MyEvents from "./pages/My-Events";
import EventForm from "./components/EventForm";

import EventDetails from "./pages/EventDetails"; 
import UserBookingsPage from "./pages/UserBookingsPage";
import BookingDetails from "./pages/BookingDetails";

import ProtectedRoute from "./auth/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/events/:id" element={<EventDetails />} /> {/* Public event details */}

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

          {/* My Events Nested Routes */}
          <Route path="my-events" element={<MyEvents />} />

          <Route
            path="/my-events/new"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <EventForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-events/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <EventForm />
              </ProtectedRoute>
            }
          />

                  {/* Standard user routes */}
          <Route
            path="bookings"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="bookings/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout" element={<LogoutForm />} />

        {/* Wildcard Route */}
        <Route path="*" element={<Navigate to={"/login"} replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
