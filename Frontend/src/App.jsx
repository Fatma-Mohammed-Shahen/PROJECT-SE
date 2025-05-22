import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LogoutForm from "./components/LogoutForm"; // adjust path as needed
import MyEvents from "./pages/My-Events";
import EventForm from "./components/EventForm";
import ForgetPasswordForm from "./components/ForgetPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import UserProfile from "./pages/UserProfile";
import EventDetails from "./pages/EventDetails"; 
import UserBookingsPage from "./pages/UserBookingsPage";
import BookingDetails from "./pages/BookingDetails";
import AllEvents from "./pages/AllEvents"; // adjust path as needed

import ProtectedRoute from "./auth/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import EventAnalytics from "./pages/EventAnalytics"; // adjust path as needed
import AdminEventsPage from "./pages/AdminEventsPage"; // Import the new page
import AdminUsersPage from "./pages/AdminUsersPage";


function App() {
  return (
    <AuthProvider>
        {/* Add ToastContainer here - outside Routes but inside AuthProvider */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/events/:id" element={<EventDetails />} /> {/* Public event details */}
        <Route path="/forgot-password" element={<ForgetPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Protected Routes with Layout and Nested Children */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "organizer"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AllEvents />} />

          {/* Index Route */}
          <Route index element={<Dashboard />} />

          {/* My Events Nested Routes */}
          <Route path="my-events" element={<MyEvents />} />
          <Route path="profile" element={<UserProfile />} />

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
          <Route
            path="/my-events/analytics"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <EventAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
          path="/admin/events"
          element={
         <ProtectedRoute allowedRoles={["admin"]}>
         <AdminEventsPage />
         </ProtectedRoute>
          }
         />
        <Route
        path="/admin/users"
        element={
        <ProtectedRoute allowedRoles={["admin"]}>
        <AdminUsersPage />
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
