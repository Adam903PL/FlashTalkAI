import React, { useState } from 'react';
import './css/home.css'; 
import './css/headerNav.css'
const Home: React.FC = () => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);

  return (
    <div className="homeContainer">
      {/* Header */}
      <header className="header">
        <div className="logo">FlashTalkAI</div>
        <div className="searchBar">
          <input type="text" placeholder="Wyszukaj..."  className='scherch'/>
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

      {/* Main content */}
      <div className="mainContainer">
        <div className="userStats">
          <div className="statCard">
            <h3>Ilość testów</h3>
            <p>12</p>
          </div>
          <div className="statCard">
            <h3>Postęp</h3>
            <p>75% wykonanych zadań</p>
          </div>
          <div className="statCard">
            <h3>Aktualny poziom</h3>
            <p>Średni</p>
          </div>
        </div>

        <div className="mainOptions">
          <div className="optionCard" onClick={() => { window.location.href = "/home/learn"; }}>
            <h3>Ucz się AI</h3>
            <p>Rozpocznij naukę z pomocą sztucznej inteligencji!</p>
          </div>
          <div className="optionCard" onClick={() => { window.location.href = "/home/voice-practice"; }}>
            <h3>Praktyka Głosowa</h3>
            <p>Ćwicz wymowę i poprawność z AI!</p>
          </div>
          <div className="optionCard" onClick={() => { window.location.href = "/home/flashcards"; }}>
            <h3>Fiszki</h3>
            <p>Ucz się i powtarzaj z fiszkami!</p>
          </div>
          <div className="optionCard" onClick={() => { window.location.href = "/home/test"; }}>
            <h3>Test</h3>
            <p>Rozpocznij nowy test sprawdzający Twoją wiedzę!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
