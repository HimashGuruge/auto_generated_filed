import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AddCard from "../components/AddCard.jsx";  // AddCard import
import UserList from "../components/UserList.jsx";
import AddUser from "../components/Adduser.jsx";
import Delete from "../components/DeletePage.jsx";

import {
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiLogOut,
  FiHome,
} from "react-icons/fi";

const variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentTab = location.pathname.split("/").pop();
    setActiveTab(currentTab);
  }, [location]);

  // Logout handler - clear token & user and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Simple auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Sidebar navigation items (AddCard එකත් එකතු කරලා)
  const navItems = [
    { path: "users", icon: <FiUsers className="mr-2" />, label: "User List" },
    { path: "add-user", icon: <FiUserPlus className="mr-2" />, label: "Add User" },
    { path: "add-card", icon: <FiUserPlus className="mr-2" />, label: "Add Card" },  // <-- New AddCard link
    { path: "settings", icon: <FiSettings className="mr-2" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white fixed top-0 left-0 h-screen flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-blue-500 p-2 rounded-lg mr-2">
              <FiHome />
            </span>
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/admin/${item.path}`}
              onClick={() => setActiveTab(item.path)}
              className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                activeTab === item.path
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab.replace("-", " ")}
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="users"
                element={
                  <motion.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <UserList />
                  </motion.div>
                }
              />
              <Route
                path="add-user"
                element={
                  <motion.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <AddUser />
                  </motion.div>
                }
              />
              <Route
                path="add-card"
                element={
                  <motion.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <AddCard />
                  </motion.div>
                }
              />
              <Route
                path="settings"
                element={
                  <motion.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <Delete />
                  </motion.div>
                }
              />
              <Route path="*" element={<Navigate to="/admin/users" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
