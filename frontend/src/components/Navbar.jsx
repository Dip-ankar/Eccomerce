import React, { useState } from "react";
import {
  Close,
  Menu,
  PersonAdd,
  Search,
  ShoppingBag,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 🔍 Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/products/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate(`/products`);
    }

    setKeyword(""); // Clear input after search
    setIsMenuOpen(false); // Close menu on mobile search
  };

  const isAuthenticated = false; // change when login system added

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 md:px-12">
        {/* 🟦 Logo */}
        <div className="text-2xl font-bold text-blue-400">
          <Link to="/">FirstShop</Link>
        </div>

        {/* 🟩 Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="hover:text-blue-400 transition duration-300 font-medium"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-blue-400 transition duration-300 font-medium"
          >
            Products
          </Link>
          <Link
            to="/about-us"
            className="hover:text-blue-400 transition duration-300 font-medium"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-400 transition duration-300 font-medium"
          >
            Contact Us
          </Link>
        </div>

        {/* 🟨 Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Search (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-gray-800 rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search product"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="px-3 py-1 bg-transparent outline-none text-sm"
            />
            <button type="submit" className="px-2">
              <Search />
            </button>
          </form>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-blue-400 transition duration-300"
          >
            <ShoppingBag />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full px-1.5">
              0
            </span>
          </Link>

          {/* Register */}
          {!isAuthenticated && (
            <Link
              to="/register"
              className="hover:text-blue-400 transition duration-300"
            >
              <PersonAdd />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-200 hover:text-blue-400 transition duration-300"
          >
            {isMenuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* 🟧 Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 flex flex-col items-center space-y-4 py-4 animate-slideDown">
          <Link
            to="/"
            onClick={toggleMenu}
            className="hover:text-blue-400 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={toggleMenu}
            className="hover:text-blue-400 transition duration-300"
          >
            Products
          </Link>
          <Link
            to="/about-us"
            onClick={toggleMenu}
            className="hover:text-blue-400 transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="hover:text-blue-400 transition duration-300"
          >
            Contact Us
          </Link>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-900 rounded-lg px-2 py-1 w-3/4"
          >
            <input
              type="text"
              placeholder="Search product"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-grow bg-transparent outline-none text-sm px-2"
            />
            <button type="submit">
              <Search />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
