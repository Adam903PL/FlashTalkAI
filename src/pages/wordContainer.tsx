import { useEffect } from "react";
import volumeMax from "../assets/volume-max.svg";
import flashcardStyles from "./css/flashcardlearn.module.css";

type Word = {
  id: number;
  word: string;
  translation: string;
};

type ResponseData = {
  success: boolean;
  message: string;
};

type WordContainerProps = {
  word: any;
  onReload: () => void;
  known: boolean;
};

function WordContainer({ word, onReload, known }: WordContainerProps) {
  const changeIsKnown = (wordId: number) => {
    console.log("Datas to send:", wordId);
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
      .then((data: ResponseData) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={known ? flashcardStyles.box_true : flashcardStyles.box_false} key={word.id}>
      <div className={flashcardStyles.wordContect}>
        <p>{word.word}</p>
        <div className={flashcardStyles.linie}></div>
        <p>{word.translation}</p>
      </div>
      <div className={flashcardStyles.wordEmoji}>
        <button
          onClick={() => {
            changeIsKnown(word.id);
            onReload();
          }}
        >
          {"❤️"}
        </button>
        <img alt="volumeMax" src={volumeMax} />
      </div>
    </div>
  );
}

export default WordContainer;
