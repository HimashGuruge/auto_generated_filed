// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/login', { email });

      if (response.status === 200) {
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success('Login successful! Redirecting...');

        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin');  // Redirect admins
          } else {
            navigate('/profile'); // Redirect other users
          }
        }, 1500);
      }
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-2xl px-8 pt-8 pb-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
