import React from 'react';
import './css/home.css';

const Home: React.FC = () => {
  return (
    <div className='homeBody'>
    <div className="home-container">
      {/* Pasek nawigacyjny */}
      <header className="header">
        <div className="logo">Nauka Niemieckiego</div>
        <input type="text" className="search-bar" placeholder="Szukaj..." />
        <div className="profile">
          <span>Profil</span>
        </div>
      </header>

      {/* Statystyki użytkownika */}
      <section className="stats">
        <div className="stat-box">
          <h3>Postęp</h3>
          <p>60%</p>
        </div>
        <div className="stat-box">
          <h3>Testy</h3>
          <p>3/5</p>
        </div>
      </section>

      {/* Sekcje nawigacyjne */}
      <section className="sections">
        <div className="section-box" id="learn-ai">
          <h2>Ucz się z AI</h2>
          <p>Praktykuj niemiecki z AI w inteligentny sposób</p>
        </div>
        <div className="section-box" id="voice-practice">
          <h2>Praktyka Głosowa AI</h2>
          <p>Doskonal swoje umiejętności wymowy</p>
        </div>
        <div className="section-box" id="flashcards">
          <h2>Fiszki</h2>
          <p>Przeglądaj i ucz się słówek za pomocą fiszek</p>
        </div>
        <div className="section-box" id="test">
          <h2>Test</h2>
          <p>Sprawdź swoją wiedzę w teście</p>
        </div>
      </section>
    </div>
    </div>
  );
};

export default Home;
