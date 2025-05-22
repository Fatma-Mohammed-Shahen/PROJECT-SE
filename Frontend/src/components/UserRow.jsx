import React, { useState } from "react";
import api from "../services/api"; // adjust the path if needed

const roles = ["admin", "organizer", "user"];

function UserRow({ user, onUserUpdated, onUserDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState(user.role);

  const handleUpdateRole = async () => {
    try {
      const response = await api.put(`/users/${user._id}`, { role: newRole });
      onUserUpdated(response.data.user);
      setIsEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      onUserDeleted(user._id);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        {isEditing ? (
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        ) : (
          user.role
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleUpdateRole}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Update Role</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}

export default UserRow;
