import React, { useEffect, useState, useRef } from "react";
import NavBar from "../navbar";

function Learn() {
  const [serverMessage, setServerMessage] = useState("");
  const [message, setMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null); // Używamy useRef, by nie tworzyć nowego WebSocket na każdym renderze

  useEffect(() => {
    // Tworzenie WebSocket tylko raz przy pierwszym renderze
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("Połączono z serverem websocket");
    };

    socketRef.current.onmessage = (event) => {
      setServerMessage(event.data);
    };

    socketRef.current.onerror = (error) => {
      console.error("Błąd WebSocket:", error);
    };

    socketRef.current.onclose = () => {
      console.log("Połączenie WebSocket zostało zamknięte.");
    };

    return () => {
      socketRef.current?.close(); // Zamknięcie połączenia przy odmontowaniu komponentu
    };
  }, []);

  const handleSendMessage = () => {
    if (socketRef.current && message) {
      console.log(message);
      socketRef.current.send(message); // Używanie istniejącego połączenia
      setMessage(""); // Czyszczenie pola wiadomości
    }
  };

  return (
    <div>
      <NavBar />
      <p>{serverMessage}</p>
      <input
        id="messs"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Mess</button>
    </div>
  );
}

export default Learn;
