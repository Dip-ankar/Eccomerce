import React, { useState } from "react";
import {
  Close,
  Menu,
  PersonAdd,
  Search,
  ShoppingBag,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate(`/products`);
    }
    setKeyword("");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md fixed w-full top-0 left-0 z-50 backdrop-blur-lg">
      <div className="flex items-center justify-around px-6 py-3 md:px-12">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide text-blue-400 hover:text-blue-500 transition">
          <Link to="/">First<span className="text-white">Shop</span></Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          {["Home", "Products", "About Us", "Contact"].map((item, i) => (
            <Link
              key={i}
              to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
              className="relative group"
            >
              <span className="group-hover:text-blue-400 transition">
                {item}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-gray-800 rounded-full overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-blue-400"
          >
            <input
              type="text"
              placeholder="Search product..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="px-3 py-1.5 bg-transparent outline-none text-sm text-gray-200 w-40 placeholder-gray-400"
            />
            <button type="submit" className="px-2 hover:text-blue-400">
              <Search />
            </button>
          </form>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-blue-400 transition"
          >
            <ShoppingBag fontSize="medium" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full px-1.5">
              0
            </span>
          </Link>

          {/* Authentication / Profile */}
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="hover:text-blue-400 transition"
              title="Register"
            >
              <PersonAdd fontSize="medium" />
            </Link>
          ) : (
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:bg-gray-800 px-3 py-1 rounded-full transition"
            >
              <img
                src={user?.avatar?.url || "/images/profile.png"}
                alt="User"
                className="w-8 h-8 rounded-full object-cover border border-gray-600"
              />
              <span className="hidden md:inline text-sm">{user?.name}</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden hover:text-blue-400 transition"
          >
            {isMenuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 flex flex-col items-center py-5 space-y-4 animate-slideDown">
          {["Home", "Products", "About Us", "Contact"].map((item, i) => (
            <Link
              key={i}
              to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
              onClick={toggleMenu}
              className="text-gray-200 hover:text-blue-400 transition text-lg"
            >
              {item}
            </Link>
          ))}

          {/* Mobile Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-800 rounded-full px-3 py-1.5 w-3/4"
          >
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-grow bg-transparent outline-none text-sm px-2 text-gray-200"
            />
            <button type="submit" className="hover:text-blue-400">
              <Search />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
