// src/pages/AddCardList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AddCardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // assuming you store JWT in localStorage

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get('http://localhost:3000/addcards', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCards(res.data);
      } catch (error) {
        console.error('Error fetching AddCards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">All Add Cards</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card._id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddCardList;
