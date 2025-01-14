import { useEffect, useState } from "react";

const LearnCards = ({ unit }: { unit: string }) => {
  const [flashcards, setFlashcards] = useState<any[]>([]); // Przechowuje słówka do nauki
  const [knownWordsIds, setKnownWordsIds] = useState<number[]>([]); // Lista znanych ID
  const [wordIndex, setWordIndex] = useState<number>(0); // Index aktualnego słówka
  const [showTranslation, setShowTranslation] = useState<boolean>(false); // Czy pokazać tłumaczenie

  // Pobieranie ID znanych słówek z backendu
  useEffect(() => {
    let from, to;
    const unitCleaned = unit.replace(".json", "");
    switch (unitCleaned) {
      case "unit1":
        from = 1;
        to = 100;
        break;
      case "unit2":
        from = 101;
        to = 200;
        break;
      case "unit3":
        from = 201;
        to = 300;
        break;
      case "unit4":
        from = 301;
        to = 400;
        break;
      case "unit5":
        from = 401;
        to = 500;
        break;
      default:
        console.error("Invalid unit");
        return;
    }

    fetch("http://localhost:4444/getKnownWordsByUnitId", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setKnownWordsIds(data);
      })
      .catch((error) => {
        console.error("Error fetching known words:", error);
      });
  }, [unit]);

  useEffect(() => {
    if (knownWordsIds.length > 0) {
      fetch(`http://localhost:4444/api/flashcards/${unit.replace(".json", "")}.json`, {
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          // Filtruj dane, pomin pierwszy element (opis) i słówka, które są znane
          const filteredFlashcards = data.slice(1).filter(
            (flashcard: any) => !knownWordsIds.includes(flashcard.id)
          );
          setFlashcards(filteredFlashcards);
        })
        .catch((error) => {
          console.error("Error fetching flashcards:", error);
        });
    }
  }, [knownWordsIds, unit]);

  useEffect(() => {
    if (flashcards.length > 0) {
      setWordIndex(0); // Reset indeksu na 0 po załadowaniu słówek
    }
  }, [flashcards]);

  // Obsługa przewijania w prawo
  const handleNext = () => {
    setWordIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowTranslation(false);
  };

  // Obsługa przewijania w lewo
  const handlePrev = () => {
    setWordIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setShowTranslation(false);
  };

  // Obsługa kliknięcia na słówko
  const handleWordClick = () => {
    setShowTranslation((prev) => !prev);
  };

  return (
    <div className="cardLearnContainer">
      {flashcards.length > 0 ? (
        <div className="cardLearnWrapper">
          <div className="cardLearn">
            <div className="arrow" onClick={handlePrev}>
              {"<"}
            </div>
            <div className="word" onClick={handleWordClick}>
              {showTranslation
                ? flashcards[wordIndex].translation
                : flashcards[wordIndex].word}
            </div>
            <div className="arrow" onClick={handleNext}>
              {">"}
            </div>
          </div>
          <h1 className="wordsAll">
            {wordIndex + 1}/{flashcards.length}
          </h1>
        </div>
      ) : (
        <p>Ładowanie...</p>
      )}
    </div>
  );
};

export default LearnCards;
