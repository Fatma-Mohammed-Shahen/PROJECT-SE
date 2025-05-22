import { useEffect, useState } from "react";
import axios from "../services/api"; // or wherever your axios instance is
import { useAuth } from "../auth/AuthContext"; // optional, to check role

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all"); // filter state: all/approved/pending/declined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const { user } = useAuth(); // optional, to check admin role client-side

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events/all");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const filteredEvents = events.filter((event) =>
    filter === "all" ? true : event.status === filter
  );

  const updateStatus = async (id, status) => {
    setActionError("");
    try {
      const res = await axios.put(`/events/${id}/status`, { status });
      // Update local state with new status
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === id ? { ...event, status: res.data.event.status } : event
        )
      );
    } catch (err) {
      setActionError("Failed to update status. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Events Management</h2>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">
          Filter by status:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {actionError && <p style={{ color: "red" }}>{actionError}</p>}

      {filteredEvents.length === 0 ? (
        <p>No events found for this filter.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Tickets</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id} className="text-center">
                <td className="border border-gray-300 p-2">{event.title}</td>
                <td className="border border-gray-300 p-2">{new Date(event.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{event.location}</td>
                <td className="border border-gray-300 p-2">
                  {event.remaining_tickets}/{event.total_tickets}
                </td>
                <td className="border border-gray-300 p-2 capitalize">{event.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {event.status !== "approved" && (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => updateStatus(event._id, "approved")}
                    >
                      Approve
                    </button>
                  )}
                  {event.status !== "declined" && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => updateStatus(event._id, "declined")}
                    >
                      Decline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminEventsPage;
