import React, { useState, useEffect } from 'react';

const AddCard = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user data from localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Log token to console
    if (token) {
      console.log('JWT Token:', token);
    }
  }, [token]);

  // Cleanup object URL on unmount or image change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMessage('');

    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB.');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!title.trim() || !description.trim()) {
      setMessage('Title and Description are required.');
      setLoading(false);
      return;
    }

    if (!token) {
      setMessage('You are not logged in.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('http://localhost:3000/addcard', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Card added successfully!');
        setTitle('');
        setDescription('');
        setImage(null);
        setPreview(null);
      } else {
        setMessage(data.error || 'Failed to add card');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      {/* Show who is logged in */}
      {user && (
        <div className="mb-6 text-center">
          <p className="text-gray-700 font-medium">
            Welcome, <span className="font-bold text-blue-600">{user.name}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Token is retrieved</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-center">Create Card</h2>

      {message && <p className="mb-4 text-center text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something..."
            className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block mb-1 font-medium text-gray-700">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 max-w-full h-auto rounded shadow"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Uploading...' : 'Create Card'}
        </button>
      </form>
    </div>
  );
};

export default AddCard;