import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to events");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  return(
    <div>
      <h2>All Events</h2>
      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id} style={{ marginBottom: "1rem" }}>
              <strong>{event.title}</strong> – {event.date} at {event.location}
              <br />
              Tickets: {event.remaining_tickets}/{event.total_tickets}
              <br />
              Status: {event.status}
              <br />
              <Link to={`/events/${event._id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}  
export default AllEventsPage;
