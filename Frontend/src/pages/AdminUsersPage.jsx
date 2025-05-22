import React, { useEffect, useState } from "react";
import api from "../services/api";  // adjust path if needed
import UserRow from "../components/UserRow"; // adjust path if needed


const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users"); // baseURL + /users
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Users Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
       <tbody>
  {users.map((user) => (
    <UserRow
      key={user._id}
      user={user}
      onUserUpdated={(updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
      }}
      onUserDeleted={(userId) => {
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      }}
    />
  ))}
</tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
