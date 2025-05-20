import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; 
import BookTicketForm from "../components/BookTicketForm";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/events/${id}`);
        //console.log('API Response:', res.data);  // << Add this line
        setEvent(res.data);
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
  

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-details">
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleString() : "Date not available"}</p>
      <p><strong>Location:</strong> {event.location || "Location not available"}</p>
      <p><strong>Price:</strong> ${Number(event.ticket_price) || "N/A"}</p>
      <p><strong>Available Tickets:</strong> {event.remaining_tickets ?? "N/A"}</p>


      {/* Only show booking form if standard user is logged in */}
      {user?.role === "user" && (
        <BookTicketForm
          eventId={event._id}
          availableTickets={event.remaining_tickets}
          ticketPrice={event.ticket_price}
        />
      )}
    </div>
  );
};

export default EventDetails;
