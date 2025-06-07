import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // Parse user info from localStorage (or null if none)
  const user = JSON.parse(localStorage.getItem('user'));

  const navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/register', label: 'Register', exact: true },
    { path: '/login', label: 'Login', exact: true },
    // Only show Admin link if user exists and is admin
    ...(user && user.role === 'admin' ? [{ path: '/admin', label: 'Admin', exact: false }] : []),
  ];

  const checkActive = (path, exact) => {
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="text-xl font-bold text-blue-400">
        <Link 
          to="/" 
          className="hover:text-blue-300 transition duration-300"
          onClick={() => window.scrollTo(0, 0)} 
        >
          MyApp
        </Link>
      </div>

      <div className="space-x-6">
        {navItems.map(({ path, label, exact }) => {
          const active = checkActive(path, exact);
          return (
            <Link
              key={path}
              to={path}
              className={`hover:text-blue-300 transition duration-300 ${
                active ? 'text-yellow-400 font-semibold' : ''
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
