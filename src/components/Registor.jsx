import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    image: null,
    role: 'user',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [emailStatus, setEmailStatus] = useState({
    loading: false,
    exists: false,
    valid: true,
  });

  const isUsernameDisabled = formData.name.trim() === '';

  const generateUsernames = useCallback((name) => {
    const base = name.toLowerCase().trim().replace(/\s+/g, '');
    return Array.from({ length: 3 }, () => base + (100 + Math.floor(Math.random() * 900)));
  }, []);

  const checkEmailExists = useCallback(
    debounce(async (email) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailStatus({ loading: false, exists: false, valid: false });
        setError('Please enter a valid email address');
        return;
      }

      setError('');
      setEmailStatus(prev => ({ ...prev, loading: true }));

      try {
        const response = await fetch(`http://localhost:3000/users/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        setEmailStatus({
          loading: false,
          exists: data.exists,
          valid: true,
        });
      } catch (err) {
        setEmailStatus(prev => ({ ...prev, loading: false }));
        setError('Failed to check email availability');
        console.error('Email check failed:', err);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.name.trim() === '') {
      setSuggestedUsernames([]);
      setFormData(prev => ({ ...prev, username: '' }));
    } else {
      const suggestions = generateUsernames(formData.name);
      setSuggestedUsernames(suggestions);

      if (
        formData.username === '' ||
        suggestedUsernames.includes(formData.username)
      ) {
        setFormData(prev => ({ ...prev, username: suggestions[0] }));
      }
    }
  }, [formData.name, generateUsernames]);

  useEffect(() => {
    if (formData.email) {
      checkEmailExists(formData.email);
    } else {
      setEmailStatus({ loading: false, exists: false, valid: true });
    }

    return () => checkEmailExists.cancel();
  }, [formData.email, checkEmailExists]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUsernameClick = (username) => {
    setFormData(prev => ({ ...prev, username }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Validate age
    if (formData.age && (isNaN(formData.age) || Number(formData.age) < 0)) {
      setError('Age must be a positive number');
      return;
    }

    // Validate email
    if (emailStatus.exists) {
      setError('Email already exists');
      return;
    }

    if (!emailStatus.valid) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const form = new FormData();
      form.append('username', formData.username);
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('age', formData.age ? Number(formData.age) : undefined); // 👈 Convert to Number
      form.append('role', formData.role);
      if (formData.image) {
        form.append('profileImage', formData.image);
      }

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('✅ User registered successfully!');
      setFormData({
        username: '',
        name: '',
        email: '',
        age: '',
        password: '',
        confirmPassword: '',
        image: null,
        role: 'user'
      });
      setPreviewImage(null);
      setSuggestedUsernames([]);
      setEmailStatus({ loading: false, exists: false, valid: true });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isUsernameDisabled}
              placeholder={isUsernameDisabled ? "Username (enter name first)" : "Username"}
              className={`w-full px-4 py-2 border rounded-lg ${isUsernameDisabled ? 'bg-gray-200' : 'bg-white'}`}
              required
            />
            {!isUsernameDisabled && suggestedUsernames.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Suggested usernames:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedUsernames.map((uname) => (
                    <button
                      key={uname}
                      type="button"
                      onClick={() => handleUsernameClick(uname)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        formData.username === uname
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {uname}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg ${
                emailStatus.exists || !emailStatus.valid
                  ? 'border-red-500 bg-red-50'
                  : formData.email && !emailStatus.exists
                  ? 'border-green-500 bg-green-50'
                  : ''
              }`}
            />
            {emailStatus.loading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              </div>
            )}
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Age (optional)"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            min="0"
          />

          {/* Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full mx-auto"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={emailStatus.exists || emailStatus.loading || !emailStatus.valid}
            className={`w-full py-2 rounded-lg transition ${
              emailStatus.exists || emailStatus.loading || !emailStatus.valid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Register
          </button>
        </form>

        {/* Messages */}
        {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default RegisterForm;