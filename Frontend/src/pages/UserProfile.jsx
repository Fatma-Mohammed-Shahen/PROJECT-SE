import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/profile`);
        setUser(res.data);
        // Initialize form data with user data
        setForm({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage("Failed to fetch user data");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/profile`, form);
      // Update local user state with new data
      setUser({
        ...user,
        ...form,
      });
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update user", error);
      setMessage("Failed to update profile");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">User Profile</h2>

      {!isEditing ? (
        <div className="space-y-3">
          <div>
            <strong className="text-gray-600">Name:</strong> <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <strong className="text-gray-600">Email:</strong> <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <strong className="text-gray-600">Role:</strong> <p className="text-lg">{user.role}</p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full rounded"
          />
         
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className={`mt-4 text-center text-sm ${
          message.includes("success") ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}