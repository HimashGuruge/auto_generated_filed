import { useEffect, useState } from "react";
import axios from "axios";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please login first.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [usersRes, adminsRes] = await Promise.all([
          axios.get("http://localhost:3000/users", config),
          axios.get("http://localhost:3000/admin/admins", config), // fixed URL
        ]);

        const combined = [...usersRes.data, ...adminsRes.data];
        setUsers(combined);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError(
          err.response && err.response.data
            ? err.response.data.error || "Failed to load users and admins."
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        {/* loading spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">{error}</div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300 mt-8 mx-auto max-w-6xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600">
          <tr>
            {["ID", "Name", "Email", "Role"].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-8 text-gray-400 italic font-semibold"
              >
                No users or admins found.
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr
                key={user._id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.role}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
