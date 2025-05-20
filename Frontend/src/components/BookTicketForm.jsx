import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookTicketForm = ({ eventId, availableTickets, ticketPrice }) => {
  const [ticketsBooked, setTicketsBooked] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleBook = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/bookings",
        {
          eventId: eventId,
          ticketsBooked: ticketsBooked,
        },
        { withCredentials: true }
      );

      setMessage(`Booking successful! Total Price: $${ticketsBooked * ticketPrice}`);

      // Navigate to booking history after short delay
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (error) {
      setMessage(
        "Booking failed: " + (error.response?.data.message || error.message)
      );
    }
  };

  return (
    <div>
      <label>
        Tickets to Book:
        <input
          type="number"
          min="1"
          max={availableTickets}
          value={ticketsBooked}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val > availableTickets) {
              setTicketsBooked(availableTickets);
            } else if (val < 1) {
              setTicketsBooked(1);
            } else {
              setTicketsBooked(val);
            }
          }}
        />
      </label>
      <p>Total Price: ${ticketsBooked * ticketPrice}</p>
      <button onClick={handleBook}>Book</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookTicketForm;
