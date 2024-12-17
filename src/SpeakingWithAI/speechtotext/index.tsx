import { useEffect, useState, useRef } from "react";

const useSpeechToText = (options) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web speech API is not supported");
      return;
    }

    // Ensure microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log("Microphone access granted");
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access.");
      });

    recognitionRef.current = new window.webkitSpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || true;
    recognition.lang = options.lang || "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
      console.log("Detected speech:", text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        console.log(
          "No speech detected. Please try again with clearer speech."
        );
        alert("No speech detected. Please try again with clearer speech.");
      }
      if (event.error === "audio-capture") {
        console.error("Microphone not working. Please check your microphone.");
        alert("Microphone not working. Please check your microphone.");
      }
      if (event.error === "not-allowed") {
        console.error("Microphone access denied.");
        alert("Microphone access denied. Please allow microphone access.");
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (isListening) {
        setIsListening(false);
      }
    };

    return () => {
      recognition.stop();
    };
  }, [options.continuous, options.lang, options.interimResults, isListening]);

  const startListening = () => {
    console.log("Starting listening...");
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    console.log("Stopping listening...");
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
