import { useState } from "react";
import useSpeechToText from "./useSpeechToText/index.jsx";

const VoiceInput = () => {
  const [textInput, setTextInput] = useState("");

  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText({ continuous: true });

  const startStopListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopVoiceInput = () => {
    setTextInput((prevVal) => prevVal + (transcript ? ` ${transcript}` : ""));
    stopListening(); // Ensure stopListening is only called here
  };

  return (
    <>
      <button onClick={startStopListening}>
        {isListening ? "Stop Listening" : "Speak"}
      </button>
      <button onClick={stopVoiceInput} disabled={!isListening}>
        Stop and Save
      </button>
      <textarea
        disabled={isListening}
        value={
          isListening
            ? textInput + (transcript.length ? ` ${transcript}` : "")
            : textInput
        }
        onChange={(e) => setTextInput(e.target.value)}
      ></textarea>
    </>
  );
};

export default VoiceInput;
