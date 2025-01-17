import { useEffect, useState } from "react";
import { useFlashCards } from "../../zustand/useFlashcards";

const LearnCards = ({ unit }: { unit: string }) => {
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  type AllowedStates = "LearnAll" | "LearnKnown" | "LearnUnKnown";
  const [learnFLtype, setLearnFLtype] = useState<AllowedStates>("LearnUnKnown");
  const [filteredFlashcards, setFilteredFlashcards] = useState<any[]>([]);
  const [fromTo, SetFromTO] = useState<number[]>([]);
  const [isKnownWord, setIsKnownWord] = useState<boolean>(false);

  const {
    flashCardsUnKnown,
    changeKnown,
    fetchUnKnownFlashCards,
    allWordsFlashcards,
    fetchAllFlashcards,
  } = useFlashCards();

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
    SetFromTO([from, to]);
    fetchUnKnownFlashCards(from, to);
    fetchAllFlashcards(unit);
  }, [unit, fetchUnKnownFlashCards, fetchAllFlashcards]);

  useEffect(() => {
    if (allWordsFlashcards && flashCardsUnKnown) {
      switch (learnFLtype) {
        case "LearnAll":
          setFilteredFlashcards(allWordsFlashcards);
          break;
        case "LearnKnown":
          const filteredKnown = allWordsFlashcards.filter(
            (card) =>
              !flashCardsUnKnown.some(
                (unknownCard) => unknownCard.flashcard_id === card.id
              )
          );
          setFilteredFlashcards(filteredKnown);
          break;
        case "LearnUnKnown":
          const filteredUnKnown = allWordsFlashcards.filter(
            (card) =>
              flashCardsUnKnown.some(
                (unknownCard) => unknownCard.flashcard_id === card.id
              )
          );
          setFilteredFlashcards(filteredUnKnown);
          break;
      }
    }
  }, [allWordsFlashcards, flashCardsUnKnown, learnFLtype]);

  const handlePrev = () => {
    setShowTranslation(false);
    setWordIndex((prevIndex) =>
      prevIndex === 0 ? filteredFlashcards.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setShowTranslation(false);
    setWordIndex((prevIndex) =>
      prevIndex === filteredFlashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleWordClick = () => {
    setShowTranslation((prev) => !prev);
  };

  const handleClick = (value: AllowedStates) => {
    setLearnFLtype(value);
  };

  const handleChangeKnown = (id: number, falseOrTrue: boolean) => {
    changeKnown(id, fromTo[0], fromTo[1], unit, falseOrTrue);
  };

  // Sprawdzanie, czy dane słowo jest znane po każdej zmianie indeksu słowa
  useEffect(() => {
    if (filteredFlashcards.length > 0) {
      const currentWord = filteredFlashcards[wordIndex];
      const isKnown = !flashCardsUnKnown.some(
        (unknownCard) => unknownCard.flashcard_id === currentWord.id
      );
      console.log("Current word ID:", currentWord.id);
      console.log("Is this word known?", isKnown);
      setIsKnownWord(isKnown); // Ustawienie stanu isKnownWord
    }else{
      console.log(filteredFlashcards,"is < 0")
    }
  }, [wordIndex, filteredFlashcards, flashCardsUnKnown]); // Użycie zależności do aktualizacji po zmianie indeksu słowa

  return (
    <>
      <div className="cardLearnContainer">
        {filteredFlashcards.length > 0 ? (
          <>
            <div
              className="cardLearnWrapper"
              style={isKnownWord ? { border: "2px solid #28a745",boxShadow:"0 4px 16px rgba(40, 167, 69, 0.5)" } : { border: "2px solid #dc3545",boxShadow:"0 4px 16px rgba(220, 53, 69, 0.5)" }}
            >
              <div className="cardLearn">
                <div className="arrow" onClick={handlePrev}>
                  {"<"}
                </div>
                <div className="word" onClick={handleWordClick}>
                  {showTranslation
                    ? filteredFlashcards[wordIndex].translation
                    : filteredFlashcards[wordIndex].word}
                </div>
                <div className="arrow" onClick={handleNext}>
                  {">"}
                </div>
              </div>
              <h1 className="wordsAll">
                <button
                  style={{ margin: "0px" }}
                  onClick={() => {
                    handleChangeKnown(filteredFlashcards[wordIndex].id, true);
                  }}
                >
                  <b>Known</b>
                </button>
                <p style={{ alignSelf: "center", justifySelf: "center" }}>
                  {wordIndex + 1}/{filteredFlashcards.length}
                </p>
                <button
                  style={{ margin: "0px" }}
                  onClick={() => {
                    handleChangeKnown(filteredFlashcards[wordIndex].id, false);
                  }}
                >
                  <b>UnKnown</b>
                </button>
              </h1>
            </div>
            <div className="buttonsLearnCards">
              <button value="LearnAll" onClick={(event) => handleClick(event.currentTarget.value)}>
                Learn All
              </button>
              <button value="LearnKnown" onClick={(event) => handleClick(event.currentTarget.value)}>
                Learn Known
              </button>
              <button value="LearnUnKnown" onClick={(event) => handleClick(event.currentTarget.value)}>
                Learn UnKnown
              </button>
            </div>
          </>
        ) : (
          <p>Ładowanie...</p>
        )}
      </div>
    </>
  );
};

export default LearnCards;