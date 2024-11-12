import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importuj useNavigate z React Router
import './css/headerNav.css';
import './css/flashcardlearn.css'

type wordsType ={
    "id":number,
    "word":string,
    "translation":string
}


function Flashcard(unit:any) {


    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const navigate = useNavigate(); 

    const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
    const handleWordClick = () => {
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);

    };

    const [wordIndex, setWordIndex] = useState(0);
    const [words, setWords] = useState<wordsType[]>([]);
    useEffect(() => {
        fetch(`/api/flashcards/${unit.unit}`)
          .then((resp) => resp.json())
          .then((data) => {
            const selectedWords = data.slice(1, 101); 
            setWords(selectedWords);  
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [unit.unit]); 


    





  return (
    <>
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
              <li onClick={() => navigate('/settings')}>Ustawienia</li> {/* Przykład nawigacji */}
              <li onClick={() => navigate('/logout')}>Wyloguj się</li> {/* Przykład nawigacji */}
              <li onClick={() => navigate('/options')}>Opcje strony</li> {/* Przykład nawigacji */}
            </ul>
          </div>
        )}
      </header>

      {/* Navigation Menu */}
      <nav className="navigationMenu">
        <ul>
          <li onClick={() => navigate('/home/learn')}>Ucz się AI</li>
          <li onClick={() => navigate('/home/voice-practice')}>Praktyka Głosowa</li>
          <li onClick={() => navigate('/home/flashcards')}>Fiszki</li>
          <li onClick={() => navigate('/home/test')}>Test</li>
        </ul>
      </nav>
    </div>
    {/*  */}
    <div className="cardLearnContainer">
            <div className="cardLearn">
                <div className="arrow" onClick={() => setWordIndex((wordIndex - 1 + words.length) % words.length)}>
                    {"<"} {/* Strzałka w lewo */}
                </div>

                <div className="word" onClick={handleWordClick}>
                    {words.length > 0 ? words[wordIndex]?.word : "Loading..."}
                </div>

                <div className="arrow" onClick={() => setWordIndex((wordIndex + 1) % words.length)}>
                    {">"} {/* Strzałka w prawo */}
                </div>
            </div>
        </div>
    </>

  );
}

export default Flashcard;
