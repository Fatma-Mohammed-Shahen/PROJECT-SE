import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function UserBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("http://localhost:5000/api/v1/users/bookings", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings); // adjust to your API's response shape
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bookings.length === 0) return <p>You have no bookings yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking._id}
            className="border p-4 rounded shadow-sm hover:bg-gray-50"
          >
            <p>
              <strong>Event:</strong> {booking.title || "Unknown Event"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Tickets:</strong> {booking.ticketsBooked || 0}
            </p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            <Link
              to={`/bookings/${booking._id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              View Booking
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
