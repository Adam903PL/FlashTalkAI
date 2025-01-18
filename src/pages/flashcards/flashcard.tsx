import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WordContainer from "./wordContainer";
import NavBar from "../NavBars/navbar";
import { useLoged } from "../../contexts/loged/useLoged";
import LearnCards from "./LearnCards";
import { useFlashCards } from "../../zustand/useFlashcards";

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

type Flashcard = {
  id: number;
  word: string;
  translation: string;
};

type Description = {
  description: string;
};

function Flashcard({ unit }: FlashcardProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [words, setWords] = useState<wordsType[]>([]);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [countWords, setCountWords] = useState(0);

  const [knownWords, setKnownWords] = useState<(Flashcard | Description)[]>([]);
  const [unKnownWords, setUnKnownWords] = useState<((Flashcard | Description)[])>([]);

  const [fromTo, SetFromTO] = useState<number[]>([]);
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
    const unKnown = flashCardsUnKnown.map((ele) => ele.flashcard_id);
    const unknownListWord = allWordsFlashcards.filter((ele) => {
      return unKnown.includes(ele.id);
    });
    setUnKnownWords(unknownListWord);
    const knownListWord = allWordsFlashcards.filter((ele) => {
      return !unKnown.includes(ele.id);
    });
    setKnownWords(knownListWord);
  }, [flashCardsUnKnown, allWordsFlashcards]);

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

  return (
    <>
      <NavBar />

      {/* Flashcard Content */}
      <LearnCards unit={unit} />

      {/* Known Words Section */}
      <div className="">
        <h1 className="text-2xl font-bold text-center text-white mb-4">Known Words</h1>
        <div className="border-t border-gray-300 mx-auto w-4/5 mb-4"></div>

        <div className="p-6 rounded-lg shadow-lg">
          {knownWords.map((word, index) => (
            <WordContainer
              key={word.id}
              word={word}
              known={true}
              unit={unit}
              fromTo={fromTo}
            />
          ))}
        </div>
      </div>

      {/* UnKnown Words Section */}
      <div className="">
        <h1 className="text-2xl font-bold text-center text-white mb-4">Known Words</h1>
        <div className="border-t border-gray-300 mx-auto w-4/5 mb-4"></div>

        <div className="p-6 rounded-lg shadow-lg">
          {unKnownWords.map((word, index) => (
            <WordContainer
              key={word.id}
              word={word}
              known={false}
              unit={unit}
              fromTo={fromTo}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Flashcard;
