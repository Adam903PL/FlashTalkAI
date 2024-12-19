import { useEffect, useState } from "react";

const LearnCards = () => {
  const [flashcards, setFlashcards] = useState<any[]>([]);  
  const [knownWordsIds, setKnownWordsIds] = useState<number[]>([]);  
  const [wordIndex, setWordIndex] = useState<number>(0);  
  const [showTranslation, setShowTranslation] = useState<boolean>(false);  

  useEffect(() => {
    fetch("http://localhost:4444/getKnownWordsByUnitId", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: 1, to: 100 }), 
    })
      .then((resp) => resp.json())
      .then((data) => {
        setKnownWordsIds(data);
      })
      .catch((error) => {
        console.error("Error fetching known words:", error);
      });
  }, []);

  
  useEffect(() => {
    if (knownWordsIds.length > 0) {
      fetch("http://localhost:4444/api/flashcards/unit1.json", {
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          const filteredFlashcards = data.filter((flashcard: any) =>
            knownWordsIds.includes(flashcard.id)
          );
          setFlashcards(filteredFlashcards);
        })
        .catch((error) => {
          console.error("Error fetching flashcards:", error);
        });
    }
  }, [knownWordsIds]);

  
  const handleNext = () => {
    setWordIndex((prevIndex) => (prevIndex + 1) % flashcards.length); 
    setShowTranslation(false);
  };

  
  const handlePrev = () => {
    setWordIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setShowTranslation(false); 
  };

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
          <h1 className="wordsAll">{wordIndex + 1}/{flashcards.length}</h1>
        </div>
      ) : (
        <p>Ładowanie...</p>
      )}
    </div>
  );
};

export default LearnCards;
