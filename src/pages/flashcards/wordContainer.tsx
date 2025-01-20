import { useEffect, useState } from "react";
import { useFlashCards } from "../../zustand/useFlashcards";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type WordContainerProps = {
  word: { id: number; word: string; translation: string };
  known: boolean;
  unit: string;
  fromTo: number[];
};

const style = {
  width: 50,
  height: 50,
};

function WordContainer({ word, known, unit, fromTo }: WordContainerProps) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    const cleanText = (text: string) => {
      // Remove non-alphabetic characters, for example, punctuation marks
      return text.replace(/[^a-zA-Z\s]/g, "      ");
    };
  
    const wordToSpeak = cleanText(word.word);
    if (wordToSpeak.trim()) {
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = "de-DE"; 
      utterance.onend = () => {
        setSpeaking(false); 
      };
      speechSynthesis.speak(utterance);
    }
  
    const translationToSpeak = cleanText(word.translation);
    if (translationToSpeak.trim()) {
      const utterance2 = new SpeechSynthesisUtterance(translationToSpeak);
      utterance2.lang = "en-GB"; 
      utterance2.onend = () => {
        setSpeaking(false); 
      };
      speechSynthesis.speak(utterance2);
    }
  };

  const { changeKnown } = useFlashCards();

  const handleChangeKnown = (id: number, falseOrTrue: boolean) => {
    changeKnown(id, fromTo[0], fromTo[1], unit, falseOrTrue);
  };

  const handleChangeUnKnown = (id: number, falseOrTrue: boolean) => {
    changeKnown(id, fromTo[0], fromTo[1], unit, falseOrTrue);
  };

  return (
    <div
      className={`flex items-center justify-between p-6 w-4/5 mx-auto mb-6 rounded-xl shadow-lg
        ${known ? 'border-4 border-green-500 animate-glow-green' : 'border-4 border-red-500 animate-glow-red'}
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
    >
      {/* Left side - Word and Translation */}
      <div className="flex-1 pr-4">
        <p className="text-3xl font-extrabold text-white">{word.word}</p>
        <div className="border-b border-gray-200 my-2"></div>
        <p className="text-2xl text-gray-200">{word.translation}</p>
      </div>

      {/* Right side - Emoji and Volume Icon */}
      <div className="flex flex-col justify-center items-center">
        <div className="mb-4">
          <button
            onClick={() => { known ? handleChangeUnKnown(word.id, false) : handleChangeKnown(word.id, true) }}
            className="text-4xl text-white bg-transparent hover:bg-blue-600 p-4 rounded-full transition-all transform hover:scale-110"
          >
            {known ? "✔️" : "❌"}
          </button>
        </div>
        <div>
          <button
            onClick={handleSpeak}
            disabled={speaking}
            className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-lg shadow-lg transition-all transform hover:scale-110"
          >
            <DotLottieReact
              src="https://lottie.host/5b55fdd1-aa4d-4008-bbe6-59453193ddb7/xlDrOQjOEQ.lottie"
              loop
              autoplay
              style={style}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordContainer;