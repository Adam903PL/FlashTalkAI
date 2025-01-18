import { useEffect, useState, useRef } from "react";
import { useFlashCards } from "../../zustand/useFlashcards";
import LottieView, { type LottieRefCurrentProps } from "lottie-react";
import animationJson from "../../assets/Loading.json";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa"; // ikony do przycisków

const LearnCards = ({ unit }: { unit: string }) => {
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [learnFLtype, setLearnFLtype] = useState<"LearnAll" | "LearnKnown" | "LearnUnKnown">("LearnUnKnown");
  const [filteredFlashcards, setFilteredFlashcards] = useState<any[]>([]);
  const [fromTo, SetFromTO] = useState<number[]>([]);
  const [isKnownWord, setIsKnownWord] = useState<boolean>(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const {
    flashCardsUnKnown,
    changeKnown,
    fetchUnKnownFlashCards,
    allWordsFlashcards,
    fetchAllFlashcards,
  } = useFlashCards();

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
          const filteredUnKnown = allWordsFlashcards.filter((card) =>
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

  const handleClick = (value: "LearnAll" | "LearnKnown" | "LearnUnKnown") => {
    setLearnFLtype(value);
  };

  const handleChangeKnown = (id: number, falseOrTrue: boolean) => {
    changeKnown(id, fromTo[0], fromTo[1], unit, falseOrTrue);
  };

  useEffect(() => {
    if (filteredFlashcards.length > 0) {
      const currentWord = filteredFlashcards[wordIndex];
      const isKnown = !flashCardsUnKnown.some(
        (unknownCard) => unknownCard.flashcard_id === currentWord.id
      );
      setIsKnownWord(isKnown);
    }
  }, [wordIndex, filteredFlashcards, flashCardsUnKnown]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-black text-white py-20">
      {filteredFlashcards.length > 0 ? (
        <div className="flex justify-center items-center">
          <div
            className={`w-[100%] lg:w-[80%] xl:w-[80%] p-16 rounded-3xl shadow-xl transition-all ${
              isKnownWord
                ? "bg-green-500 border-8 border-green-700"
                : "bg-red-500 border-8 border-red-700"
            } flex flex-col items-center`}
          >
            <div className="flex justify-between w-full mb-16">
              <button
                onClick={handlePrev}
                className="text-5xl text-white hover:text-gray-200 transition-all"
              >
                <FaArrowLeft />
              </button>
              <div
                onClick={handleWordClick}
                className="text-6xl font-semibold text-center cursor-pointer px-6"
              >
                {showTranslation
                  ? filteredFlashcards[wordIndex].translation
                  : filteredFlashcards[wordIndex].word}
              </div>
              <button
                onClick={handleNext}
                className="text-5xl text-white hover:text-gray-200 transition-all"
              >
                <FaArrowRight />
              </button>
            </div>
            <div className="mt-16 flex justify-between items-center w-full text-xl">
              <button
                className="bg-green-700 text-white py-4 px-12 rounded-lg text-2xl"
                onClick={() =>
                  handleChangeKnown(filteredFlashcards[wordIndex].id, true)
                }
              >
                <FaCheck /> Known
              </button>
              <p className="text-3xl font-bold">
                {wordIndex + 1}/{filteredFlashcards.length}
              </p>
              <button
                className="bg-red-700 text-white py-4 px-12 rounded-lg text-2xl"
                onClick={() =>
                  handleChangeKnown(filteredFlashcards[wordIndex].id, false)
                }
              >
                <FaTimes /> UnKnown
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <LottieView animationData={animationJson} lottieRef={lottieRef} />
        </div>
      )}

      <div className="flex justify-center mt-16 space-x-8">
        <button
          value="LearnAll"
          onClick={() => handleClick("LearnAll")}
          className="bg-blue-600 text-white py-6 px-12 rounded-xl text-3xl hover:bg-blue-500"
        >
          Learn All
        </button>
        <button
          value="LearnKnown"
          onClick={() => handleClick("LearnKnown")}
          className="bg-yellow-600 text-white py-6 px-12 rounded-xl text-3xl hover:bg-yellow-500"
        >
          Learn Known
        </button>
        <button
          value="LearnUnKnown"
          onClick={() => handleClick("LearnUnKnown")}
          className="bg-gray-600 text-white py-6 px-12 rounded-xl text-3xl hover:bg-gray-500"
        >
          Learn UnKnown
        </button>
      </div>
    </div>
  );
};

export default LearnCards;
