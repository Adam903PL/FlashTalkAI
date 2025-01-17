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
    const text = word.word;
    if (text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB"; 
      utterance.onend = () => {
        setSpeaking(false); 
      };
      speechSynthesis.speak(utterance);
    }

    const text2 = word.translation;
    if (text2.trim()) {
      const utterance2 = new SpeechSynthesisUtterance(text2);
      utterance2.lang = "de-DE"; 
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
    <div className={`flex items-center justify-between p-4 w-4/5 mx-auto mb-4 rounded-lg shadow-lg ${known ? 'border-green-500 bg-green-200' : 'border-red-500 bg-red-200'}`}>
      {/* Left side - Word and Translation */}
      <div className="flex-1 pr-4">
        <p className="text-2xl font-bold text-gray-800">{word.word}</p>
        <div className="border-b border-gray-300 my-2"></div>
        <p className="text-xl text-gray-600">{word.translation}</p>
      </div>

      {/* Right side - Emoji and Volume Icon */}
      <div className="flex flex-col justify-center items-center">
        <div className="mb-4">
          <button
            onClick={() => { known ? handleChangeUnKnown(word.id, false) : handleChangeKnown(word.id, true) }}
            className="text-3xl text-white bg-transparent hover:bg-blue-500 p-2 rounded-full transition"
          >
            {known ? "✔️" : "❌"}
          </button>
        </div>
        <div>
          <button
            onClick={handleSpeak}
            disabled={speaking}
            className="p-2 bg-blue-500 rounded-lg transition-all transform hover:scale-110"
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
