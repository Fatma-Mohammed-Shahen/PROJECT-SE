import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function UserBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false); // toggle between bookings & history

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
        setBookings(data.bookings);
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

  // Filter valid bookings only (excluding "Unknown Event")
  const validBookings = bookings.filter(
    (booking) => booking.eventName && booking.eventName !== "Unknown Event"
  );

  // Separate active and canceled bookings
  const activeBookings = validBookings.filter((b) => b.status !== "canceled");
  const canceledBookings = validBookings.filter((b) => b.status === "canceled");

  const displayBookings = showHistory ? canceledBookings : activeBookings;

  if (displayBookings.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">
          {showHistory ? "Booking History" : "My Bookings"}
        </h2>
        <p>{showHistory ? "No canceled bookings yet." : "You have no current bookings."}</p>
        <div className="mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showHistory ? "Back to My Bookings" : "View Booking History"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {showHistory ? "Booking History" : "My Bookings"}
      </h2>

      <div className="mb-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showHistory ? "Back to My Bookings" : "View Booking History"}
        </button>
      </div>

      <ul className="space-y-4">
        {displayBookings.map((booking) => (
          <li
            key={booking._id}
            className="border p-4 rounded shadow-sm hover:bg-gray-50"
          >
            <p>
              <strong>Event:</strong> {booking.eventName}
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
