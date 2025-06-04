import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold text-blue-400">
        <Link to="/" className="hover:text-blue-300 transition duration-300">
          MyApp
        </Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-300 transition duration-300">Home</Link>
        <Link to="/register" className="hover:text-blue-300 transition duration-300">Register</Link>
        <Link to="/login" className="hover:text-blue-300 transition duration-300">Login</Link>
        <Link to="/admin" className="hover:text-blue-300 transition duration-300">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
