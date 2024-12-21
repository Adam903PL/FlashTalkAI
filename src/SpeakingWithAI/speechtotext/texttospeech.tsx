import { useState } from "react";
import useSpeechToText from "./index.jsx";

const VoiceInput = ({ value, onChange, placeholder, className, id }) => {
    const [textInput, setTextInput] = useState(value || "");

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
        const newValue = textInput + (transcript ? ` ${transcript}` : "");
        setTextInput(newValue);
        onChange && onChange({ target: { value: newValue } });
        stopListening();
    };

    return (
        <div>
            <button onClick={startStopListening}>
                {isListening ? "Stop Listening" : "Speak"}
            </button>
            <button onClick={stopVoiceInput} disabled={!isListening}>
                Stop and Save
            </button>
            <textarea
                id={id}
                className={className}
                disabled={isListening}
                value={
                    isListening
                        ? textInput + (transcript.length ? ` ${transcript}` : "")
                        : textInput
                }
                placeholder={placeholder}
                onChange={(e) => {
                    setTextInput(e.target.value);
                    onChange && onChange(e);
                }}
            ></textarea>
        </div>
    );
};

export default VoiceInput;
