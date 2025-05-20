import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookTicketForm = ({ eventId, availableTickets, ticketPrice }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPrice = quantity * ticketPrice;

  const handleBooking = async () => {
    if (quantity < 1 || quantity > availableTickets) {
      return toast.error("Invalid ticket quantity.");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/v1/bookings", {
        eventId,
        ticketsBooked: quantity,
      });

      toast.success("Booking successful!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to book tickets. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-ticket-form">
      <h3>Book Tickets</h3>
      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          min={1}
          max={availableTickets}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={handleBooking} disabled={loading}>
        {loading ? "Booking..." : "Book"}
      </button>
    </div>
  );
};

export default BookTicketForm;
