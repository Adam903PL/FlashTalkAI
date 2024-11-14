import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import navStyles from './css/headerNav.module.css';
import flashcardStyles from './css/flashcardlearn.module.css';

type wordsType = {
    id: number;
    word: string;
    translation: string;
};

type FlashcardProps = {
    unit: number | string;  
};

function Flashcard(unit:FlashcardProps) {
    const [wordIndex, setWordIndex] = useState(0);
    const [words, setWords] = useState<wordsType[]>([]);
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [currentWord,setCurrentWord] = useState(0)
    const [countWords,setCountWords] = useState(0)
    const navigate = useNavigate(); 

    const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
    const handleWordClick = () => {
        setShowTranslation((prev) => !prev);
    };

    // const showTranslationNextCard = () => {
    //     setShowTranslation((prev) => !prev);
    // };



    useEffect(() => {
        fetch(`/api/flashcards/${unit.unit}`)
          .then((resp) => resp.json())
          .then((data) => {
            const selectedWords = data.slice(1, 101); 
            setCountWords(selectedWords.length)
            setWords(selectedWords);  
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [unit.unit]); 


    return (
        <>
            <div className={navStyles.homeContainer}>
                {/* Header */}
                <header className={navStyles.header}>
                    <div className={navStyles.logo}>FlashTalkAI</div>
                    <div className={navStyles.searchBar}>
                        <input type="text" placeholder="Wyszukaj..." className={navStyles.scherch} />
                    </div>
                    <div className={navStyles.userIcon} onClick={toggleUserMenu}>
                        <i className="fas fa-user"></i>
                    </div>
                    {userMenuVisible && (
                        <div className={navStyles.userMenu}>
                            <ul>
                                <li onClick={() => navigate('/settings')}>Ustawienia</li>
                                <li onClick={() => navigate('/logout')}>Wyloguj się</li>
                                <li onClick={() => navigate('/options')}>Opcje strony</li>
                            </ul>
                        </div>
                    )}
                </header>

                {/* Navigation Menu */}
                <nav className={navStyles.navigationMenu}>
                    <ul>
                        <li onClick={() => navigate('/home/learn')}>Ucz się AI</li>
                        <li onClick={() => navigate('/home/voice-practice')}>Praktyka Głosowa</li>
                        <li onClick={() => navigate('/home/flashcards')}>Fiszki</li>
                        <li onClick={() => navigate('/home/test')}>Test</li>
                    </ul>
                </nav>
            </div>

            {/* Flashcard Content */}
            <div className={flashcardStyles.cardLearnContainer}>
                <div className={flashcardStyles.cardLearn}>
                    <div
                        className={flashcardStyles.arrow}
                        onClick={() => {
                            setWordIndex((wordIndex - 1 + words.length) % words.length);
                            setCurrentWord(prev=>prev-1)
                            handleWordClick()
                        }}
                    >
                        {"<"}
                    </div>

                    <div className={flashcardStyles.word} onClick={handleWordClick}>
                    {words.length > 0
                            ? showTranslation
                                ? words[wordIndex]?.translation
                                : words[wordIndex]?.word
                            : "Loading..."}
                    <h5>{currentWord}/{countWords}</h5>
                    </div>
                    

                    <div
                        className={flashcardStyles.arrow}
                        onClick={() => {
                            setWordIndex((wordIndex + 1) % words.length);
                            setCurrentWord(prev=>prev+1)
                            handleWordClick()
                        }}
                    >
                        {">"}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Flashcard;
