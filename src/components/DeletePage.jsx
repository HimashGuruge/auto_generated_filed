import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    name: '',
    email: '',
    age: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersRes = await axios.get('http://localhost:3000/users');
      const adminsRes = await axios.get('http://localhost:3000/admins');
      setUsers([...usersRes.data, ...adminsRes.data]);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setDeletingId(id);
    setError(null);

    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (user) => {
    setEditingId(user._id);
    setEditForm({
      username: user.username,
      name: user.name,
      email: user.email,
      age: user.age || '',
      role: user.role,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ username: '', name: '', email: '', age: '', role: 'user' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'age' && value !== '' ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.put(`http://localhost:3000/users/${editingId}`, editForm);
      setUsers((prev) =>
        prev.map((user) => (user._id === editingId ? res.data.user : user))
      );
      cancelEditing();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user.');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Username</th>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Age</th>
              <th className="border border-gray-300 p-2 text-left">Role</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingId === user._id ? (
                <tr key={user._id} className="bg-yellow-50">
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      name="age"
                      min="0"
                      value={editForm.age}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{user.username}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.age ?? '-'}</td>
                  <td className="border border-gray-300 p-2 capitalize">{user.role}</td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    <button
                      onClick={() => startEditing(user)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                      className={`px-3 py-1 rounded text-white ${
                        deletingId === user._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {deletingId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserTable;
