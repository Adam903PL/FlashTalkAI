import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoged } from "../../contexts/loged/useLoged";

function NavBar() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const { loged, setloged } = useLoged();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Wyszukiwanie:", searchQuery); 
  };



  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  const toggleNavMenu = () => setNavMenuVisible(!navMenuVisible);

  const logout = () => {
    fetch("http://localhost:4444/logout", { credentials: "include" }).catch(
      (err) => console.error("Errors during logout:", err)
    );
    setloged(false);
    navigate("/login");
  };

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
            value={searchQuery}
            onChange={handleSearchChange}
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

        {/* User Options */}
        <div className="relative">
          <h1
            className="text-lg font-semibold cursor-pointer mr-6"
            onClick={toggleExpand}
          >
            Options ⚙️
          </h1>
          {isExpanded && (
            <div className="absolute right-0 bg-gray-800 text-white rounded-lg shadow-lg mt-2 p-4 z-50">
              <ul className="space-y-2">
                <li
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => navigate("/settings")}
                >
                  Ustawienia
                </li>
                <li
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={logout}
                >
                  Wyloguj się
                </li>
                <li
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => navigate("/options")}
                >
                  Opcje strony
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu */}
      {(navMenuVisible || window.innerWidth > 768) && (
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-900 text-white p-4 rounded-xl mx-4 mb-4 shadow-lg">
          <div
            className="group flex flex-col items-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-neon-blue"
            onClick={() => navigate("/home/learn")}
          >
            <i className="fas fa-brain text-lg mb-1 text-neon-blue group-hover:text-white transition"></i>
            <span className="text-sm text-neon-blue group-hover:text-white transition">
              Ucz się AI
            </span>
          </div>
          <div
            className="group flex flex-col items-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-neon-pink"
            onClick={() => navigate("/home/voice-practice")}
          >
            <i className="fas fa-microphone text-lg mb-1 text-neon-pink group-hover:text-white transition"></i>
            <span className="text-sm text-neon-pink group-hover:text-white transition">
              Praktyka Głosowa
            </span>
          </div>
          <div
            className="group flex flex-col items-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-neon-green"
            onClick={() => navigate("/home/flashcards")}
          >
            <i className="fas fa-clone text-lg mb-1 text-neon-green group-hover:text-white transition"></i>
            <span className="text-sm text-neon-green group-hover:text-white transition">
              Fiszki
            </span>
          </div>
          <div
            className="group flex flex-col items-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-neon-yellow"
            onClick={() => navigate("/home/test")}
          >
            <i className="fas fa-file-alt text-lg mb-1 text-neon-yellow group-hover:text-white transition"></i>
            <span className="text-sm text-neon-yellow group-hover:text-white transition">
              Test
            </span>
          </div>
        </nav>
      )}
    </>
  );
}

export default NavBar;
