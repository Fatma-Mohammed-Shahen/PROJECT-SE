import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get("/organizer");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/events/${id}`);
      // Remove deleted event from state so UI updates
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      setDeleteError("");
    } catch (err) {
      setDeleteError("Failed to delete the event. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Events</h2>
      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
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
              <Link to={`/my-events/${event._id}/edit`}>
                <button>Edit Event</button>
              </Link>
              {" "}
              <button onClick={() => handleDelete(event._id)}>Delete Event</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyEventsPage;
