import { useEffect, useState } from "react";
import volumeMax from "../assets/volume-max.svg";
import "../css/flashcardlearn.css";
import { useLoged } from "../../contexts/loged/useLoged";
import { useNavigate } from "react-router-dom";
import { useFlashCards } from "../../zustand/useFlashcards";

type WordContainerProps = {
  word: { id: number; word: string; translation: string };
  known: boolean;
  unit:string;
  fromTo: number[];
};

function WordContainer({ word, known,unit,fromTo }: WordContainerProps) {

  const {changeKnown} = useFlashCards();



  const handleChangeKnown = (id: number, falseOrTrue: boolean) => {
    changeKnown(id, fromTo[0], fromTo[1], unit, falseOrTrue);
  };
  const handleChangeUnKnown = (id: number, falseOrTrue: boolean) => {
    changeKnown(id, fromTo[0], fromTo[1], unit, falseOrTrue);
  };
  return (
    <div
    className={`box ${known?"known":"unknown"}`}
    >
      <div className="wordContect">
        <p onClick={() => {return 0 }}>{word.word}</p>
        <div className="linie2"></div>
        <p>{word.translation}</p>
      </div>
      <div className="wordEmoji">
        <button onClick={() => {known ? handleChangeUnKnown(word.id, false) : handleChangeKnown(word.id, true)}}>
          {known ? "✔️" : "❌"}
        </button>
      </div>
      {/* <img alt="volumeMax" src={volumeMax} /> */}
    </div>
  );
}

export default WordContainer;
