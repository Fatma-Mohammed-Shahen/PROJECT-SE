import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useAuth } from "../auth/AuthContext";

const EventAnalytics = () => {
  const [data, setData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/users/events/analytics", {
          withCredentials: true,
        });
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      }
    };

    if (user?.role === "organizer") {
      fetchAnalytics();
    }
  }, [user]);

  if (user?.role !== "organizer") {
    return <div className="text-center text-red-500 mt-10">Access denied. Organizers only.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Event Booking Analytics</h2>
      {data.length === 0 ? (
        <p>No analytics data found.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="percentageBooked" fill="#8884d8" name="% Booked" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EventAnalytics;
