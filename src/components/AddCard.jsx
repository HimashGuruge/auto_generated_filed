import React, { useState } from "react";

function AddCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");  // Token එක ලබා ගන්න

    if (!token) {
      setMessage("Login කරලා token එක ලබා ගන්න.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/addcards", { // Backend URL එක
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add card");
      }

      setMessage("Card added successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          className="w-full mb-4 px-3 py-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Card
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default AddCard;
