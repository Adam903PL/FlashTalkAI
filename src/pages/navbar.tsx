import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoged } from "../contexts/loged/useLoged";

function NavBar() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const { loged, setloged } = useLoged();
  const navigate = useNavigate();

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  const toggleNavMenu = () => setNavMenuVisible(!navMenuVisible);
  const logout = () => {
    fetch("http://localhost:4444/logout", { credentials: "include" })
      .catch((err) => {console.error("Error during logout:", err)});
    setloged(false);
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <h1 className="text-2xl font-semibold text-white">FlashTalkAI</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex-grow max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Hamburger Icon */}
          <button
            className="lg:hidden p-2 text-white hover:text-blue-400"
            onClick={toggleNavMenu}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* User Icon */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="text-white hover:text-blue-400 transition-all"
            >
              <i className="fas fa-user"></i>
            </button>

            {/* User Menu */}
            <div className="absolute right-0 mt-2 bg-gray-800 shadow-lg rounded-lg border border-gray-700 w-40">
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate("/options")}
                  >
                    Site Options
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav
        className={`${
          navMenuVisible || window.innerWidth > 1024
            ? "block"
            : "hidden"
        } bg-gray-900 lg:flex justify-center items-center space-x-6 py-4 border-t-2 border-gray-700`}
      >
        <ul className="flex space-x-6">
          <li
            className="cursor-pointer text-white hover:text-blue-400 transition-all"
            onClick={() => navigate("/home/learn")}
          >
            Learn AI
          </li>
          <li
            className="cursor-pointer text-white hover:text-blue-400 transition-all"
            onClick={() => navigate("/home/voice-practice")}
          >
            Voice Practice
          </li>
          <li
            className="cursor-pointer text-white hover:text-blue-400 transition-all"
            onClick={() => navigate("/home/flashcards")}
          >
            Flashcards
          </li>
          <li
            className="cursor-pointer text-white hover:text-blue-400 transition-all"
            onClick={() => navigate("/home/test")}
          >
            Test
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
