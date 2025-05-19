import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/api";

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    total_tickets: 0,
    price: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // event id from URL
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      axios
        .get(`/events/${id}`)
        .then((res) => {
          const event = res.data;
          setFormData({
            title: event.title || "",
            date: event.date ? event.date.substring(0, 10) : "",
            location: event.location || "",
            total_tickets: event.total_tickets || 0,
            price: event.price || 0,
          });
        })
        .catch(() => {
          setError("Failed to load event");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const { date, location, total_tickets } = formData;
        await axios.put(`/events/${id}`, { date, location, total_tickets });
        alert("Event updated");
      } else {
        await axios.post("/events", formData);
        alert("Event created");
      }
      navigate("/my-events");
    } catch (err) {
      setError("Failed to submit event");
    }
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <div>
      <h2>{isEditing ? "Edit Event" : "Create Event"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isEditing} // Make title uneditable if editing
        />
        <input
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={isEditing} // Optional: make price uneditable
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="total_tickets"
          placeholder="Total Tickets"
          value={formData.total_tickets}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? "Update Event" : "Create Event"}</button>
      </form>
    </div>
  );
};

export default EventForm;
