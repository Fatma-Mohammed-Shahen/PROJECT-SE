import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/bookings/${id}`, {
          credentials: "include", // ensures cookies/session info is sent
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(true);
      }
    };

    fetchBooking();
  }, [id]);

  if (error) {
    return <p className="text-center mt-10 text-red-500">Failed to load booking details.</p>;
  }

  if (!booking) {
    return <p className="text-center mt-10">Loading booking details...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4 border p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-4">Booking Details</h1>

      <p><span className="font-semibold">Event:</span> {booking.event.title}</p>
      <p><span className="font-semibold">Date:</span> {new Date(booking.event.date).toLocaleDateString()}</p>
      <p><span className="font-semibold">Total Price:</span> ${booking.totalPrice}</p>
      <p><span className="font-semibold">Booking ID:</span> {booking._id}</p>

      <button
        onClick={() => navigate("/bookings")}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to My Bookings
      </button>
    </div>
  );
}
