import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Toolbar from "./components/Toolbar.jsx";
import Home from "./components/Home.jsx";
import Regitor from "./components/Registor.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";

// Lazy Load Admin Dashboard
const AdminDashboard = lazy(() => import("./components/AdminDashboard.jsx"));

const PageLayout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageLayout>
            <Home />
          </PageLayout>
        } />
        <Route path="/admin/*" element={
          
            <AdminDashboard />
         
        } />
        <Route path="/register/" element={
          <PageLayout>
            <Regitor />
          </PageLayout>
        } />
        <Route path="/login" element={
          <PageLayout>
            <Login />
          </PageLayout>
        } />
        <Route path="/profile" element={
          <PageLayout>
            <Profile />
          </PageLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  return (
    <Router>
      <Toolbar />
      <Suspense fallback={<div className="text-center mt-10 text-gray-600">Loading...</div>}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;