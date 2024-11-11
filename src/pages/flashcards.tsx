import { useState } from "react";
import "./css/headerNav.css"



function Flashcards(){
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);

    // const [flashCards,setFlashCards] = useState([])



    return (
        <div className="homeContainer">
          {/* Header */}
          <header className="header">
            <div className="logo">FlashTalkAI</div>
            <div className="searchBar">
              <input type="text" placeholder="Wyszukaj..." className="scherch" />
            </div>
            <div className="userIcon" onClick={toggleUserMenu}>
              <i className="fas fa-user"></i>
            </div>
            {userMenuVisible && (
              <div className="userMenu">
                <ul>
                  <li>Ustawienia</li>
                  <li>Wyloguj się</li>
                  <li>Opcje strony</li>
                </ul>
              </div>
            )}
          </header>
      {/* Navigation Menu */}
      <nav className="navigationMenu">
        <ul>
          <li onClick={() => { window.location.href = "/home/learn"; }}>Ucz się AI</li>
          <li onClick={() => { window.location.href = "/home/voice-practice"; }}>Praktyka Głosowa</li>
          <li onClick={() => { window.location.href = "/home/flashcards"; }}>Fiszki</li>
          <li onClick={() => { window.location.href = "/home/test"; }}>Test</li>
        </ul>
      </nav>
    </div> 
    




);
}

export default Flashcards;