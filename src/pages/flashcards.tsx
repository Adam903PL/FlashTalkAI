import { useEffect, useState } from "react";
import navStyles from "./css/headerNav.module.css";
import cardStyles from "./css/card.module.css";
import Card from "./card";

function Flashcards() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [units, setUnits] = useState<string[]>([]);

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  useEffect(() => {
    fetch("http://localhost:4444/loginSucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes == false) {
          window.location.href = "/login";
          // navigate("/home");
        }
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:4444/api/flashcards", { credentials: "include" })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setUnits(data);
      })
      .catch((error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Stan units zmieniony:", units);
  }, [units]);

  return (
    <>
      <div className={navStyles.homeContainer}>
        {/* Header */}
        <header className={navStyles.header}>
          <div className={navStyles.logo}>FlashTalkAI</div>
          <div className={navStyles.searchBar}>
            <input
              type="text"
              placeholder="Wyszukaj..."
              className={navStyles.scherch}
            />
          </div>
          <div className={navStyles.userIcon} onClick={toggleUserMenu}>
            <i className="fas fa-user"></i>
          </div>
          {userMenuVisible && (
            <div className={navStyles.userMenu}>
              <ul>
                <li>Ustawienia</li>
                <li>Wyloguj się</li>
                <li>Opcje strony</li>
              </ul>
            </div>
          )}
        </header>

        {/* Navigation Menu */}
        <nav className={navStyles.navigationMenu}>
          <ul>
            <li
              onClick={() => {
                window.location.href = "/home/learn";
              }}
            >
              Ucz się AI
            </li>
            <li
              onClick={() => {
                window.location.href = "/home/voice-practice";
              }}
            >
              Praktyka Głosowa
            </li>
            <li
              onClick={() => {
                window.location.href = "/home/flashcards";
              }}
            >
              Fiszki
            </li>
            <li
              onClick={() => {
                window.location.href = "/home/test";
              }}
            >
              Test
            </li>
          </ul>
        </nav>
      </div>

      {/* Flashcards */}
      <div className={cardStyles.flashcards}>
        {units.map((data: string, index) => (
          <Card key={index} unit={data} />
        ))}
      </div>
    </>
  );
}

export default Flashcards;
