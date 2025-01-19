import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/headerNav.css";
import { useLoged } from "../contexts/loged/useLoged";

function NavBar() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const { loged, setloged } = useLoged();
  const navigate = useNavigate();

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  const toggleNavMenu = () => setNavMenuVisible(!navMenuVisible);

  const logout = () => {
    fetch("http://localhost:4444/logout", { credentials: "include" }).catch(
        (err) => {
          console.error("Errors during logout:", err);
        }
    );
    setloged(false);
    navigate("/login");
  };

  return (
      <>
        {/* Header */}
        <header className="header">
          <div className="logo" onClick={() => navigate("/home")}>
            <h1>FlashTalkAI</h1>
          </div>

          <div className="searchContainer">
            <input
                type="text"
                placeholder="Wyszukaj..."
                className="searchInput"
            />
          </div>
          <h1 className="navToggleBtn" onClick={toggleNavMenu}>
            asdadas
          </h1>
          <div className="userContainer" onClick={toggleUserMenu}>
            <h1 className="Options">Options ⚙️</h1>
            {userMenuVisible && (
                <div className="userMenu">
                  <ul>
                    <li onClick={() => navigate("/settings")}>Ustawienia</li>
                    <li onClick={logout}>Wyloguj się</li>
                    <li onClick={() => navigate("/options")}>Opcje strony</li>
                  </ul>
                </div>
            )}
          </div>
        </header>

        {/* Toggle button for navMenu */}


        {/* Navigation Menu */}
        <nav className={`navMenu ${navMenuVisible ? "expanded" : ""}`}>
          <ul>
            <li onClick={() => navigate("/home/learn")}>Ucz się AI</li>
            <li onClick={() => navigate("/home/voice-practice")}>
              Praktyka Głosowa
            </li>
            <li onClick={() => navigate("/home/flashcards")}>Fiszki</li>
            <li onClick={() => navigate("/home/test")}>Test</li>
          </ul>
        </nav>
      </>
  );
}

export default NavBar;

