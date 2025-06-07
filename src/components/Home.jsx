import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AddCardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = 'http://localhost:3000';

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(`${baseUrl}/addcard`);
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
    <div className="min-h-screen bg-gray-100 p-6 relative overflow-x-hidden">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">All Add Cards</h1>

      {loading ? (
        <p className="text-center z-10 relative">Loading...</p>
      ) : cards.length === 0 ? (
        <p className="text-center text-gray-500 z-10 relative">No cards found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
          {cards.map((card) => (
            <div
              key={card._id}
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer relative"
            >
              {card.image ? (
                <img
                  src={card.image.startsWith('http') ? card.image : `${baseUrl}${card.image}?t=${Date.now()}`}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : null}
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
