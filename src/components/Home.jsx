import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded shadow text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the User Management System</h1>
      <p className="mb-6 text-lg text-gray-700">
        Manage your users easily by viewing, editing, and deleting user accounts.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => navigate('/users')}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Users
        </button>

        <button
          onClick={() => navigate('/about')}
          className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          About
        </button>
      </div>
    </div>
  );
}

export default HomePage;
