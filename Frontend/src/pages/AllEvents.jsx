import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";
import { useAuth } from "../auth/AuthContext";

const AllEventsPage = () => {
  const { user } = useAuth(); // Get current user's role
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  useEffect(() => {
  let filtered = events;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
    );
  }

  setFilteredEvents(filtered);
}, [searchTerm, events]);


  return (
    <div>
      <h2>All Events</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.4rem" }}
        />

      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events match your search/filter.</p>
      ) : (
        <ul>
          {filteredEvents.map((event) => (
            <li key={event._id} style={{ marginBottom: "1rem" }}>
              <strong>{event.title}</strong> – {event.date} at {event.location}
              <br />
              Tickets: {event.remaining_tickets}/{event.total_tickets}
              <br />
              {/* Only admins see the status */}
              {user?.role === "admin" && (
                <div>Status: {event.status}</div>
              )}
              <Link to={`/events/${event._id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AllEventsPage;
