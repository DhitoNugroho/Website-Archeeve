import React from 'react';
// Pastikan semua komponen dari react-router-dom yang digunakan telah diimpor
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path jika perlu

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  // Definisi handleLogout
  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
      if (setSidebarOpen) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Tambahkan penanganan error jika perlu
    }
  };

  // Definisi handleLinkClick
  const handleLinkClick = () => {
    if (sidebarOpen && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const isNavLinkActive = (path) => {
    // Untuk path root "/", kita ingin match yang eksak.
    // Untuk path lain, kita ingin match jika pathname dimulai dengan path tersebut (untuk sub-rute).
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Kiri */}
      <nav
        className={`fixed inset-y-0 left-0 w-64 lg:w-72 xl:w-80 bg-white text-primary-text shadow-xl min-h-screen 
                  transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 font-sans`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Logo */}
          <Link
            to="/" 
            className="text-3xl font-extrabold text-gray-800 mb-10 flex items-center focus:outline-none focus:ring-2 focus:ring-cheese-yellow rounded-md" 
            onClick={handleLinkClick}
          >
            <span className="text-4xl mr-2.5 text-cheese-yellow">🧀</span>
            Archeeve
          </Link>

          {/* Tautan Navigasi Utama */}
          <div className="flex-grow space-y-2.5 text-lg">
            {[
              { to: "/", label: "Home" },
              { to: "/categories", label: "Categories" },
              { to: "/tags", label: "Tags" },
              { to: "/search", label: "Search" },
            ].map(link => (
              <NavLink
                key={link.to}
                exact={link.to === "/"} // exact hanya untuk root path
                to={link.to} 
                className={`block py-3 px-4 rounded-lg text-primary-text hover:bg-light-gray hover:text-cheese-yellow focus:bg-light-gray focus:text-cheese-yellow focus:outline-none transition duration-200 ease-in-out ${
                  isNavLinkActive(link.to) ? 'bg-light-gray text-cheese-yellow font-semibold' : ''
                }`}
                onClick={handleLinkClick}
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <hr className="border-t border-light-gray my-5" />
                {isAdmin ? (
                  <NavLink
                    to="/admin/dashboard" 
                    className={`block py-3 px-4 rounded-lg font-medium focus:outline-none transition duration-200 ease-in-out ${
                      isNavLinkActive('/admin/dashboard') 
                        ? 'bg-cheese-yellow text-white font-semibold' 
                        : 'text-primary-text hover:bg-light-gray hover:text-cheese-yellow focus:bg-light-gray focus:text-cheese-yellow'
                    }`}
                    onClick={handleLinkClick}
                  >
                    Admin Dashboard
                  </NavLink>
                ) : (
                  <NavLink
                    to="/dashboard" 
                    className={`block py-3 px-4 rounded-lg font-medium focus:outline-none transition duration-200 ease-in-out ${
                      isNavLinkActive('/dashboard') 
                        ? 'bg-cheese-yellow text-white font-semibold' 
                        : 'text-primary-text hover:bg-light-gray hover:text-cheese-yellow focus:bg-light-gray focus:text-cheese-yellow'
                    }`}
                    onClick={handleLinkClick}
                  >
                    Dashboard
                  </NavLink>
                )}
                {/* Link "Edit Profile" telah dihilangkan dari sini */}
                <NavLink
                  to="/my-articles" 
                  className={`block py-3 px-4 rounded-lg text-primary-text hover:bg-light-gray hover:text-cheese-yellow focus:bg-light-gray focus:text-cheese-yellow focus:outline-none transition duration-200 ease-in-out ${
                    isNavLinkActive('/my-articles') ? 'bg-light-gray text-cheese-yellow font-semibold' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  My Articles
                </NavLink>
              </>
            )}
          </div>

          {/* Login/Logout Section */}
          <div className="mt-auto pt-5 border-t border-light-gray">
            {!isAuthenticated ? (
              <div className="space-y-2.5">
                <Link
                  to="/login" 
                  className="block text-center bg-light-gray text-primary-text font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition duration-200 ease-in-out" 
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
                <Link
                  to="/register" 
                  className="block text-center bg-cheese-yellow text-white font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 focus:opacity-90 focus:outline-none transition duration-200 ease-in-out" 
                  onClick={handleLinkClick}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <span className="text-sm text-secondary-text mb-2.5">
                  Logged in as: <br/>
                  <span className="font-semibold text-primary-text">{user?.name || 'User'}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="w-full text-center bg-red-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-600 focus:bg-red-600 focus:outline-none transition duration-200 ease-in-out"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
