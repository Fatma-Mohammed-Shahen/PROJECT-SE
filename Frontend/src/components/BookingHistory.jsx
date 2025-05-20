import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/bookings/user", { withCredentials: true });
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load booking history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/bookings/${bookingId}/cancel`, {}, { withCredentials: true });
      toast.success("Booking canceled");
      fetchBookings(); // Refresh list after cancel
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) return <p>Loading booking history...</p>;

  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div>
      <h2>My Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Tickets</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.event.title}</td>
              <td>{new Date(b.event.date).toLocaleString()}</td>
              <td>{b.ticketsBooked}</td>
              <td>${b.totalPrice}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "Confirmed" && (
                  <button onClick={() => handleCancel(b._id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingHistory;
