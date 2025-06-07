import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    age: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [emailStatus, setEmailStatus] = useState({
    loading: false,
    exists: false,
    valid: true
  });

  const isUsernameDisabled = formData.name.trim() === '';

  // Username suggestions generate කිරීම
  const generateUsernames = useCallback((name) => {
    const base = name.toLowerCase().trim().replace(/\s+/g, '');
    return Array.from({ length: 3 }, () => base + (100 + Math.floor(Math.random() * 900)));
  }, []);

  // Debounced email check with cleanup
  const checkEmailExists = useCallback(
    debounce(async (email) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailStatus({ loading: false, exists: false, valid: false });
        return;
      }

      setEmailStatus(prev => ({ ...prev, loading: true }));

      try {
        const response = await fetch(`http://localhost:3000/users/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        setEmailStatus({
          loading: false,
          exists: data.exists,
          valid: true
        });
      } catch (err) {
        setEmailStatus(prev => ({ ...prev, loading: false }));
        console.error('Email check failed:', err);
      }
    }, 500),
    []
  );

  // name වෙනස්වීමත් සමග username suggestions update කිරීම
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
  }, [formData.name, generateUsernames]); // suggestedUsernames remove කරලා dependency list එකෙන් (avoid infinite loop)

  // email වෙනස්වීම check කරන්න
  useEffect(() => {
    if (formData.email) {
      checkEmailExists(formData.email);
    } else {
      setEmailStatus({ loading: false, exists: false, valid: true });
    }

    // Cleanup debounce on unmount or email change
    return () => checkEmailExists.cancel();
  }, [formData.email, checkEmailExists]);

  // form fields update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // username suggestions click handler
  const handleUsernameClick = (username) => {
    setFormData(prev => ({ ...prev, username }));
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Age validation
    if (formData.age && (isNaN(formData.age) || Number(formData.age) < 0)) {
      setError('Age must be a positive number');
      return;
    }

    if (emailStatus.exists) {
      setError('Email already exists');
      return;
    }

    if (!emailStatus.valid) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          age: formData.age ? Number(formData.age) : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to register user');

      setSuccess('✅ User registered successfully!');
      setFormData({ username: '', name: '', email: '', age: '' });
      setSuggestedUsernames([]);
      setEmailStatus({ loading: false, exists: false, valid: true });
    } catch (err) {
      setError(err.message);
    }
  };

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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                ${isUsernameDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white cursor-text'}`}
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
         {/* Email */}
<div className="relative">
  <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    required
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
      emailStatus.exists || !emailStatus.valid
        ? 'border-red-500 focus:ring-red-400 bg-red-50'
        : formData.email && !emailStatus.exists && emailStatus.valid
          ? 'border-green-500 focus:ring-green-400 bg-green-50'
          : 'focus:ring-blue-400'
    }`}
  />
  {emailStatus.loading && (
    <div className="absolute right-3 top-2.5">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
    </div>
  )}
</div>


          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Age (optional)"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="0"
          />

          {/* Submit */}
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
        {error && !emailStatus.exists && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default RegisterForm;
