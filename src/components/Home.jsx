import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <section className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Welcome to the User Management System
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Manage your users easily by viewing, editing, and deleting user accounts.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate('/users')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Navigate to User List"
          >
            View Users
          </button>

          <button
            onClick={() => navigate('/about')}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold shadow hover:bg-gray-700 transition focus:outline-none focus:ring-4 focus:ring-gray-400"
            aria-label="Navigate to About Page"
          >
            About
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
