import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AddCardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const baseUrl = 'http://localhost:3000';

  // Load saved dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  // Fetch cards from backend
  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${baseUrl}/addcard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(res.data);
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <main className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {darkMode ? (
            <>
              ☀️ Light Mode
            </>
          ) : (
            <>
              🌙 Dark Mode
            </>
          )}
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">
        All Add Cards
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : cards.length === 0 ? (
        <p className="text-center">No cards found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card._id}
              className={`rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ${
                darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
              }`}
            >
              {card.image && (
                <img
                  src={card.image.startsWith('http') ? card.image : `${baseUrl}${card.image}`}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AddCardList;