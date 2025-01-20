import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoged } from "../../contexts/loged/useLoged";
import { useSpring, animated } from "react-spring"; // Importujemy react-spring

function NavBar() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    fetch("http://localhost:4444/get-userid", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.userId);
        setUserId(data.userId);
      })
      .catch((err) => console.error("Błąd podczas pobierania userId:", err));
  }, []);
  const { loged, setloged } = useLoged();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
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

  // Animacja pulsowania neonowego efektu na ikonie
  const userIconSpring = useSpring({
    opacity: userMenuVisible ? 1 : 0.8,
    transform: userMenuVisible ? "scale(1.1)" : "scale(1)",
    boxShadow: userMenuVisible ? "0 0 10px 5px rgba(0, 255, 255, 0.8)" : "none",
    config: { tension: 250, friction: 12 },
  });

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
            {/* Neonowy efekt na ikonie */}
            <animated.div
              style={userIconSpring}
              className="w-12 h-12 rounded-full border-4 border-blue-400 overflow-hidden cursor-pointer"
            >
              <img
                src={`https://storage.googleapis.com/flashtalkai/ProfilePictures/user${userId}.png?timestamp=${Date.now()}`} // Wstaw URL zdjęcia użytkownika
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </animated.div>
          </h1>
          {isExpanded && (
            <div className="absolute right-0 bg-gray-800 text-white rounded-lg shadow-lg mt-2 p-4 z-50">
              <ul className="space-y-2">
                <li
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </li>
                <li
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={logout}
                >
                  Logout
                </li>
                <li
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => navigate("/options")}
                >
                  Page options
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
              Learn With AI
            </span>
          </div>
          <div
            className="group flex flex-col items-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-neon-pink"
            onClick={() => navigate("/home/voice-practice")}
          >
            <i className="fas fa-microphone text-lg mb-1 text-neon-pink group-hover:text-white transition"></i>
            <span className="text-sm text-neon-pink group-hover:text-white transition">
              Voice Practice
            </span>
          </div>
          <div
            className="group flex flex-col items-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition transform hover:scale-105 shadow-md hover:shadow-neon-green"
            onClick={() => navigate("/home/flashcards")}
          >
            <i className="fas fa-clone text-lg mb-1 text-neon-green group-hover:text-white transition"></i>
            <span className="text-sm text-neon-green group-hover:text-white transition">
              Flashcards
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
