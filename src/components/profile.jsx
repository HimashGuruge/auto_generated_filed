import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        {user.profileImage ? (
          <img
            src={`http://localhost:3000${user.profileImage}`}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        ) : (
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* Welcome Message */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome</h1>

      {/* User Info */}
      <div className="space-y-4 text-gray-700 text-left">
        <p>
          <span className="font-semibold text-gray-900">Name:</span> {user.name || 'N/A'}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Role:</span> {user.role || 'User'}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
