import { useEffect, useState } from "react";
import volumeMax from "../assets/volume-max.svg";
import "../css/flashcardlearn.css";
import { useLoged } from "../../contexts/loged/useLoged";
import { useNavigate } from "react-router-dom";
import { useFlashCards } from "../../zustand/useFlashcards";
import volumeAnimation from "../../assets/animations/volume.json"
import { useLottie } from "lottie-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type WordContainerProps = {
  word: { id: number; word: string; translation: string };
  known: boolean;
  unit:string;
  fromTo: number[];
};

const style = {
  width: 50,  
  height: 50, 
};


function WordContainer({ word, known,unit,fromTo }: WordContainerProps) {
  const [speaking, setSpeaking] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
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
    const text2 = word.translation
    if(text2.trim()){
      const utterance2 = new SpeechSynthesisUtterance(text2)
      utterance2.lang = "de-DE"; 
      utterance2.onend = () => {
        setSpeaking(false); 
      };
      speechSynthesis.speak(utterance2);
    }
  };



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
      <div style={{display:"flex",flexDirection:"row"}}>
      <div className="wordEmoji">
        <button onClick={() => {known ? handleChangeUnKnown(word.id, false) : handleChangeKnown(word.id, true)}}>
          {known ? "✔️" : "❌"}
        </button>
      </div>
    <div className="wordEmoji">
    <button onClick={handleSpeak} disabled={speaking} style={{padding:"5px",backgroundColor:"rgba(0, 153, 255)"}}>
    <DotLottieReact
              src="https://lottie.host/5b55fdd1-aa4d-4008-bbe6-59453193ddb7/xlDrOQjOEQ.lottie"
              loop
              autoplay
              style={style}
            />
      </button>
    </div>
      </div>
      {/* <img alt="volumeMax" src={volumeMax} /> */}
    </div>
  );
}

export default WordContainer;
