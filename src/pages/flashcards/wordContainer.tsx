import { useEffect, useState } from "react";
import volumeMax from "../assets/volume-max.svg";
import "../css/flashcardlearn.css";
import { useLoged } from "../../contexts/loged/useLoged";
import { useNavigate } from "react-router-dom";

type WordContainerProps = {
  word: { id: number; word: string; translation: string };
  onReload: () => void;
  known: boolean;
};

function WordContainer({ word, onReload, known }: WordContainerProps) {
  const [isKnown, setIsKnown] = useState(known);

  const navigate = useNavigate()

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
    className={`box ${isKnown?"known":"unknown"}`}
    >
      <div className="wordContect">
        <p onClick={() => {return 0 }}>{word.word}</p>
        <div className="linie2"></div>
        <p>{word.translation}</p>
      </div>
      <div className="wordEmoji">
        <button onClick={() => changeIsKnown(word.id)}>
          {isKnown ? "✔️" : "❌"}
        </button>
      </div>
      {/* <img alt="volumeMax" src={volumeMax} /> */}
    </div>
  );
}

export default WordContainer;
