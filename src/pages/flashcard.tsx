


  import { useEffect, useState, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import navStyles from "./css/headerNav.module.css";
  import flashcardStyles from "./css/flashcardlearn.module.css";
  
  import WordContainer from "./wordContainer";
  import NavBar from "./navbar";
  type wordsType = {
    id: number;
    word: string;
    translation: string;
  };
  
  type FlashcardProps = {
    unit: any;
  };
  
  type Word = {
    id: number;
    word: string;
    translation: string;
    known: boolean;
  };
  
  function Flashcard({ unit }: FlashcardProps) {
    const [wordIndex, setWordIndex] = useState(0);
    const [words, setWords] = useState<wordsType[]>([]);
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [countWords, setCountWords] = useState(0);
  
    const [knownWords, setKnownWords] = useState<Word[]>([]);
  
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
      fetch(`http://localhost:4444/api/flashcards/${unit}`, {
        credentials: "include",
      })
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
  
  
    useEffect(() => {
      fetch("http://localhost:4444/loginSucces", {
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.succes === false) {
            window.location.href = "/login";
          }
        })
        .catch((error) => {
          console.error("Error during login check:", error);
        });

      let lastChar = unit.replace('.json','')
      const from =  Number(lastChar.charAt(lastChar.length - 1)) == 1 ? 1 :  Number(lastChar.charAt(lastChar.length - 1)) * 100
      const to = from == 1 ? from+ 99 : from + 100
      console.log("Fetching words with range:", { from, to });
      fetch("http://localhost:4444/getAllWords", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from:from, to:to }),
        // body: JSON.stringify({from:1,to:100}),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Network response was not ok");
          }
          return resp.json();
        })
        .then((data: any) => {
          console.log("Data fetched from API:", data)
          let known: any[] = [];
          if (data.success && Array.isArray(data.data)) {
            data.data.map((val: any) => {
              known.push(val);
            });
  
            setKnownWords(known);
  
          } else {
            console.error("Unexpected response format:", data);
          }
        })
        .catch((error) => {
          console.error("Błąd przy pobieraniu słów:", error);
        });
    }, []);
  
    const handleReload = () => {
      fetch(`http://localhost:4444/api/flashcards/${unit}`, {
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          const selectedWords = data.slice(1, 101);
          setCountWords(selectedWords.length);
          setWords(selectedWords);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
        let lastChar = unit.replace('.json','')
        const from =  Number(lastChar.charAt(lastChar.length - 1)) == 1 ? 1 :  Number(lastChar.charAt(lastChar.length - 1)) * 100
        const to = from == 1 ? from+ 99 : from + 100
    
      fetch("http://localhost:4444/getAllWords", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: from, to: to }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Network response was not ok");
          }
          return resp.json();
        })
        .then((data: any) => {
          let known: any[] = [];
          if (data.success && Array.isArray(data.data)) {
            data.data.map((val: any) => {
              known.push(val);
            });
  
            setKnownWords(known);
          } else {
            console.error("Unexpected response format:", data);
          }
        })
        .catch((error) => {
          console.error("Błąd przy pobieraniu słów:", error);
        });
    };
  
    return (
      <>
        <NavBar></NavBar>
  
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
        <h1 style={{ margin: "0 0 0 10%" }}>Known Words</h1>
        <div className={flashcardStyles.linie}></div>
        <div>
          {knownWords.map((word, index) => {
            const main = words.find(
              (mainW) => mainW.id === word.flashcard_id && word.known === true
            );
            console.log("Checking word:", word, "Found main:", main ? main : NaN);
            if (main !== undefined) {
              return (
                <WordContainer
                  key={main.id}
                  word={main}
                  onReload={handleReload}
                  known={true}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
        <h1 style={{ margin: "0 0 0 10%" }}>UnKnown Words</h1>
        <div className={flashcardStyles.linie}></div>
        <div>
          {knownWords.map((word, index) => {
            const main = words.find(
              (mainW) => mainW.id === word.flashcard_id && word.known === false
            );
            console.log("Checking word:", word, "Found main:", main ? main : NaN);
            if (main !== undefined) {
              return (
                <WordContainer
                  key={main.id}
                  word={main}
                  onReload={handleReload}
                  known={false}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </>
    );
  }
  
  export default Flashcard;