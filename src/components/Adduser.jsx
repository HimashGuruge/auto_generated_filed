import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AddUser() {
  // State declarations
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    age: "",
    role: "user",
  });

  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // artificial delay

      const response = await axios.post("http://localhost:3000/users", formData);
      setMessage({ type: "success", text: response.data.message || "User added successfully!" });
      setFormData({ username: "", name: "", email: "", age: "", role: "user" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to add user.",
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 text-center text-gray-600 font-medium">
        Loading...
      </div>
    );
  }

  // Motion variants for inputs
  const inputVariants = {
    focused: {
      scale: 1.03,
      boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)", // blue glow
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    unfocused: {
      scale: 1,
      boxShadow: "none",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-12 font-sans text-gray-900">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700">
        Add New User
      </h2>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-center font-semibold ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {[
          {
            label: "Username",
            name: "username",
            type: "text",
            placeholder: "Enter username",
            required: true,
          },
          {
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter full name",
            required: true,
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Enter email",
            required: true,
          },
          {
            label: "Age",
            name: "age",
            type: "number",
            placeholder: "Enter age (optional)",
            required: false,
            min: 0,
          },
        ].map(({ label, name, type, placeholder, required, min }) => (
          <motion.div
            key={name}
            initial="unfocused"
            whileFocus="focused"
            animate="unfocused"
          >
            <label
              htmlFor={name}
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              {label}
            </label>
            <motion.input
              id={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
              placeholder={placeholder}
              min={min}
              variants={inputVariants}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
              onFocus={(e) =>
                e.currentTarget.parentElement.setAttribute("data-focused", "true")
              }
              onBlur={(e) =>
                e.currentTarget.parentElement.removeAttribute("data-focused")
              }
              autoComplete="off"
            />
          </motion.div>
        ))}

        <motion.div
          initial="unfocused"
          whileFocus="focused"
          animate="unfocused"
          className="mb-6"
        >
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Role
          </label>
          <motion.select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            variants={inputVariants}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none"
            onFocus={(e) =>
              e.currentTarget.parentElement.setAttribute("data-focused", "true")
            }
            onBlur={(e) =>
              e.currentTarget.parentElement.removeAttribute("data-focused")
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </motion.select>
        </motion.div>

        <motion.button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-md flex justify-center items-center shadow-md ${
            submitting ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
          } transition-colors duration-200`}
          whileHover={submitting ? {} : { scale: 1.05 }}
          whileTap={submitting ? {} : { scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {submitting && (
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 1,
              }}
              className="mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading spinner"
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <motion.circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                transformBox="fill-box"
                transformOrigin="center"
              />
              <motion.path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                transformBox="fill-box"
                transformOrigin="center"
              />
            </motion.svg>
          )}
          {submitting ? "Adding..." : "Add User"}
        </motion.button>
      </form>
    </div>
  );
}

export default AddUser;
