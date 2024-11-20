import { useState } from "react";
import volumeMax from "../assets/volume-max.svg";
import flashcardStyles from "./css/flashcardlearn.module.css";

type WordContainerProps = {
  word: { id: number; word: string; translation: string };
  onReload: () => void;
  known: boolean;
};

function WordContainer({ word, onReload, known }: WordContainerProps) {
  const [isKnown, setIsKnown] = useState(known);

  const changeIsKnown = (wordId: number) => {
    fetch("http://localhost:4444/changeKnown", {
      method: "POST",
      credentials: "include",
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
      .then(() => {
        setIsKnown((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div
      className={`${flashcardStyles.box} ${
        isKnown ? flashcardStyles.known : flashcardStyles.unknown
      }`}
    >
      <div className={flashcardStyles.wordContect}>
        <p>{word.word}</p>
        <div className={flashcardStyles.linie2}></div>
        <p>{word.translation}</p>
      </div>
      <div className={flashcardStyles.wordEmoji}>
        <button onClick={() => changeIsKnown(word.id)}>
          {isKnown ? "✔️" : "❌"}
        </button>
      </div>
      {/* <img alt="volumeMax" src={volumeMax} /> */}
    </div>
  );
}

export default WordContainer;
