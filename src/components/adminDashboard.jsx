import { Link, Routes, Route, Navigate } from "react-router-dom";

// Dummy components for each dashboard page
function UserList() {
  return <div>User List Page</div>;
}

function AddUser() {
  return <div>Add User Page</div>;
}

function Analytics() {
  return <div>Analytics Page</div>;
}

function Settings() {
  return <div>Settings Page</div>;
}

function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin! 👋</h1>
      <p className="text-gray-700 mb-6">
        Here you can manage users, view analytics, and configure settings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-lg">🔢 Total Users</h3>
          <p className="text-3xl mt-2">128</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-lg">🟢 Active Users</h3>
          <p className="text-3xl mt-2">98</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-lg">🕒 Logged in Today</h3>
          <p className="text-3xl mt-2">17</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">🛠️ Admin Panel</h2>
        <ul className="space-y-3">
          <li>
            <Link to="/admin/users" className="block hover:bg-gray-700 px-3 py-2 rounded">
              📋 User List
            </Link>
          </li>
          <li>
            <Link to="add-user" className="block hover:bg-gray-700 px-3 py-2 rounded">
              ➕ Add User
            </Link>
          </li>
          <li>
            <Link to="analytics" className="block hover:bg-gray-700 px-3 py-2 rounded">
              📊 Analytics
            </Link>
          </li>
          <li>
            <Link to="settings" className="block hover:bg-gray-700 px-3 py-2 rounded">
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Routes>
          {/* Redirect from /admin to /admin/home or default */}
          <Route index element={<DashboardHome />} />
          <Route path="users" element={ <UserList/>  } />
          <Route path="add-user" element={<AddUser />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          {/* Catch-all: Redirect unknown admin routes to dashboard home */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
