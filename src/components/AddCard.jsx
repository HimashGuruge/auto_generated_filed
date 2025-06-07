import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get('http://localhost:3000/cards'); // No JWT token
        setCards(res.data);
      } catch (err) {
        setError('Cards ලබාගැනීමේදී දෝෂයක් සිදු වුණා');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Cards List</h2>
      {cards.length === 0 ? (
        <p>No cards found.</p>
      ) : (
        cards.map((card) => (
          <div key={card._id} className="mb-4 p-4 border rounded shadow-sm">
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="mb-2">{card.description}</p>
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CardList;
