import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <section className="max-w-3xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* User List Card */}
        <div
          onClick={() => navigate('/users')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') navigate('/users'); }}
          className="cursor-pointer bg-white rounded-lg shadow-lg p-10 flex flex-col items-center justify-center
                     hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Navigate to User List"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-4">View Users</h2>
          <p className="text-gray-600 text-center">
            Manage your users easily by viewing, editing, and deleting user accounts.
          </p>
        </div>

        {/* About Page Card */}
        <div
          onClick={() => navigate('/about')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') navigate('/about'); }}
          className="cursor-pointer bg-white rounded-lg shadow-lg p-10 flex flex-col items-center justify-center
                     hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
          aria-label="Navigate to About Page"
        >
          <h2 className="text-3xl font-bold text-gray-700 mb-4">About</h2>
          <p className="text-gray-600 text-center">
            Learn more about this User Management System and its features.
          </p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
