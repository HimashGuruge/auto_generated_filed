import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/register', label: 'Register', exact: true },
    { path: '/login', label: 'Login', exact: true },
    { path: '/admin', label: 'Admin', exact: false },
  ];

  const checkActive = (path, exact) => {
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md animate-fadeInDown">
      <div className="text-xl font-bold text-blue-400">
        <Link to="/" className="hover:text-blue-300 transition duration-300">
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
