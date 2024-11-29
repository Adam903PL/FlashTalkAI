import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/headerNav.css";
import { useLoged } from "../contexts/loged/useLoged";

function NavBar() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const navigate = useNavigate();
  const {loged} = useLoged()

  
  useEffect(() => {
    if(loged == false)
      {navigate("/home")}
    else{
      NaN
    }
  }, []);
  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  const toggleNavMenu = () => setNavMenuVisible(!navMenuVisible);

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

        <div className="menuToggle" onClick={toggleNavMenu}>
          <i className={`fas fa-bars "hamburgerIcon"`}></i>
        </div>

        <div className="userContainer" onClick={toggleUserMenu}>
          <i className={`fas fa-user "userIcon"`}></i>
          {userMenuVisible && (
            <div className="userMenu">
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
        <nav className="navMenu">
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
