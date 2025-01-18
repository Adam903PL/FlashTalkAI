import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NavBarUnloged = () => {
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const navigate = useNavigate();

  const toggleNavMenu = () => setNavMenuVisible(!navMenuVisible);

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl shadow-lg mx-4 sm:mx-6">
        {/* Logo */}
        <div
          className="text-lg font-bold text-blue-400 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          FlashTalkAI
        </div>

        {/* Search Bar (visible on larger screens) */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <input
            type="text"
            placeholder="Wyszukaj..."
            className="w-3/5 p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Hamburger Menu (for small screens) */}
        <div
          className="md:hidden text-2xl cursor-pointer"
          onClick={toggleNavMenu}
        >
          <i className="fas fa-bars"></i>
        </div>

        {/* Navigation Buttons: Login / Register */}
        <div className="space-x-4 hidden sm:flex">
          <button
            onClick={() => navigate("/login")}
            className="text-white bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-white bg-green-600 hover:bg-green-500 py-2 px-4 rounded-lg transition"
          >
            Register
          </button>
        </div>
      </header>

      {/* Navigation Menu for Small Screens */}
      {navMenuVisible && (
        <nav className="bg-gray-900 text-white p-4 rounded-xl mx-4 mb-4 shadow-lg">
          <div
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </div>
          <div
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-lg"
            onClick={() => navigate("/register")}
          >
            Register
          </div>
          <div
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-lg"
            onClick={() => navigate("/about")}
          >
            About Us
          </div>
          <div
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-lg"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </div>
        </nav>
      )}
    </>
  );
};
