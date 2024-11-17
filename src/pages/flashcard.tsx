import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import navStyles from "./css/headerNav.module.css";
import flashcardStyles from "./css/flashcardlearn.module.css";
import volumeMax from "../assets/volume-max.svg";
type wordsType = {
  id: number;
  word: string;
  translation: string;
};

type FlashcardProps = {
  unit: number | string;
};
type ResponseData = {
  success: boolean;
  message: string;
};

function Flashcard({ unit }: FlashcardProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [words, setWords] = useState<wordsType[]>([]);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [countWords, setCountWords] = useState(0);
  
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);

  const handleWordClick = () => {
    setShowTranslation((prev) => !prev);
  };

  const handleArrowClick = (direction: "next" | "prev") => {
    if (direction === "next") {
      setWordIndex((wordIndex + 1) % words.length);
    } else {
      setWordIndex((wordIndex - 1 + words.length) % words.length);
    }
    setShowTranslation(false);
  };

  useEffect(() => {
    fetch(`http://localhost:4444/api/flashcards/${unit}`)
      .then((resp) => resp.json())
      .then((data) => {
        const selectedWords = data.slice(1, 101);
        setCountWords(selectedWords.length);
        setWords(selectedWords);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [unit]);


  const changeIsKnown = (wordId: number) => {
    console.log("Datas to send:",wordId)
    fetch('http://localhost:4444/changeKnown', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordId }),  
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data: ResponseData) => {
            console.log(data);
        })
        .catch((error) => {
            console.error("Błąd:", error);
        });
};

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
                <li onClick={() => navigate("/settings")}>Ustawienia</li>
                <li onClick={() => navigate("/logout")}>Wyloguj się</li>
                <li onClick={() => navigate("/options")}>Opcje strony</li>
              </ul>
            </div>
          )}
        </header>

        {/* Navigation Menu */}
        <nav className={navStyles.navigationMenu}>
          <ul>
            <li onClick={() => navigate("/home/learn")}>Ucz się AI</li>
            <li onClick={() => navigate("/home/voice-practice")}>
              Praktyka Głosowa
            </li>
            <li onClick={() => navigate("/home/flashcards")}>Fiszki</li>
            <li onClick={() => navigate("/home/test")}>Test</li>
          </ul>
        </nav>
      </div>

      {/* Flashcard Content */}
      <div className={flashcardStyles.cardLearnContainer}>
        <div ref={cardRef} className={flashcardStyles.cardLearn}>
          <div
            className={flashcardStyles.arrow}
            onClick={() => handleArrowClick("prev")}
          >
            {"<"}
          </div>

          <div className={flashcardStyles.word} onClick={handleWordClick}>
            {words.length > 0
              ? showTranslation
                ? words[wordIndex]?.translation
                : words[wordIndex]?.word
              : "Loading..."}
            <h5>
              {wordIndex + 1}/{countWords}
            </h5>
          </div>

          <div
            className={flashcardStyles.arrow}
            onClick={() => handleArrowClick("next")}
          >
            {">"}
          </div>
        </div>
      </div>
      {/* Mapujemy przez słowa i renderujemy komponent Word */}

      {/* chciałem tu dac odzienego tsx ale coś wypierdala bład jak dodaje w odzienym tsx style i się nie ładuja */}
      <div className={flashcardStyles.words}>
        {words.map((word) => (
          <div className={flashcardStyles.box}>
            <div className={flashcardStyles.wordContect}>
              <p>{word.word}</p>
              <div className={flashcardStyles.linie}></div>
              <p>{word.translation}</p>
            </div>
            <div className={flashcardStyles.wordEmoji}>
              <button onClick={()=>{changeIsKnown(word.id)} }>{"<3"}</button>
              <img alt="volumeMax" src={volumeMax} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Flashcard;
