import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import UserList from "../components/UserList.jsx";
import AddUser from "../components/Adduser.jsx";
import Delete from "../components/DeletePage.jsx";

import { FiUsers, FiUserPlus, FiSettings, FiLogOut, FiHome } from "react-icons/fi";

const variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const location = useLocation();

  useEffect(() => {
    const currentTab = location.pathname.split("/").pop();
    setActiveTab(currentTab);
  }, [location]);

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  const navItems = [
    { path: "users", icon: <FiUsers className="mr-2" />, label: "User List" },
    { path: "add-user", icon: <FiUserPlus className="mr-2" />, label: "Add User" },
    { path: "settings", icon: <FiSettings className="mr-2" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Static no animation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-blue-500 p-2 rounded-lg mr-2">
              <FiHome />
            </span>
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/admin/${item.path}`}
              onClick={() => handleClick(item.path)}
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
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content with animation on route switch */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
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
