
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

  return (
    <div className="user-bookings-page">
      <h2 className="title">{showHistory ? "Booking History" : "My Bookings"}</h2>

      <div className="button-wrapper">
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Back to My Bookings" : "View Booking History"}
        </button>
      </div>

      {displayBookings.length === 0 ? (
        <p>{showHistory ? "No canceled bookings yet." : "You have no current bookings."}</p>
      ) : (
        <ul>
          {displayBookings.map((booking) => (
            <li key={booking._id}>
              <p><strong>Event:</strong> {booking.eventName}</p>
              <p>
                <strong>Date:</strong>{" "}
                {booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p><strong>Tickets:</strong> {booking.ticketsBooked || 0}</p>
              <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={booking.status === "confirmed" ? "status-confirmed" : "status-canceled"}>
                  {booking.status}
                </span>
              </p>


              <Link
                to={`/bookings/${booking._id}`}
                className="view-link"
              >
                View Booking
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
