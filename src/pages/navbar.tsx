import { useState } from "react";
import { useNavigate } from "react-router-dom";
import navStyles from "./css/headerNav.module.css";

function NavBar() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  const toggleNavMenu = () => setNavMenuVisible(!navMenuVisible);

  return (
    <>
      {/* Header */}
      <header className={navStyles.header}>
        <div className={navStyles.logo} onClick={() => navigate("/home")}>
          <h1>FlashTalkAI</h1>
        </div>

        <div className={navStyles.searchContainer}>
          <input
            type="text"
            placeholder="Wyszukaj..."
            className={navStyles.searchInput}
          />
        </div>

        <div className={navStyles.menuToggle} onClick={toggleNavMenu}>
          <i className={`fas fa-bars ${navStyles.hamburgerIcon}`}></i>
        </div>

        <div className={navStyles.userContainer} onClick={toggleUserMenu}>
          <i className={`fas fa-user ${navStyles.userIcon}`}></i>
          {userMenuVisible && (
            <div className={navStyles.userMenu}>
              <ul>
                <li onClick={() => navigate("/settings")}>Ustawienia</li>
                <li onClick={() => navigate("/logout")}>Wyloguj się</li>
                <li onClick={() => navigate("/options")}>Opcje strony</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu */}
      {(navMenuVisible || window.innerWidth > 768) && (
        <nav className={navStyles.navMenu}>
          <ul>
            <li onClick={() => navigate("/home/learn")}>Ucz się AI</li>
            <li onClick={() => navigate("/home/voice-practice")}>
              Praktyka Głosowa
            </li>
            <li onClick={() => navigate("/home/flashcards")}>Fiszki</li>
            <li onClick={() => navigate("/home/test")}>Test</li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default NavBar;
