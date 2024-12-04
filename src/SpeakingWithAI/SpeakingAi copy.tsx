import React, { useEffect, useState, useRef } from "react";
import NavBar from "../navbar";
import "../css/chat.css";
import { useParams } from "react-router";

function Learn() {
  let topic = useParams();
  const [conversation, setConversation] = useState<
    { message: string; maker: string }[]
  >([]);
  const [serverMessage, setServerMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("Połączono z serwerem WebSocket");
      socketRef.current?.send(JSON.stringify({ type: "topic", topic }));
    };

    socketRef.current.onmessage = (event) => {
      const datas = JSON.parse(event.data);
      setConversation((prev) => [...prev, datas]);
    };

    socketRef.current.onerror = (error) => {
      console.error("Błąd WebSocket:", error);
    };

    socketRef.current.onclose = () => {
      console.log("Połączenie WebSocket zostało zamknięte.");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (serverMessage) {
      setConversation((prev) => [
        ...prev,
        { type: "message", message: serverMessage, maker: "FlashAI" },
      ]);
    }
  }, [serverMessage]);

  const handleSendMessage = () => {
    if (socketRef.current && message) {
      const messageObj = { type: "message", message, maker: "user" };
      setConversation((prev) => [...prev, messageObj]);
      socketRef.current.send(JSON.stringify(messageObj));
      setMessage("");
    }
  };
  useEffect(() => {
    if (conversation[conversation.length + 1]?.message == "“Test passed") {
      console.log("Test zdany");
    }
  }, [conversation]);
  return (
    <div>
      <NavBar />
      <div className="conversation">
        {conversation.map((msg, index) => (
          <p
            key={index}
            className={msg.maker === "user" ? "userMessage" : "serverMessage"}
          >
            <strong>{msg.maker}: </strong>
            {msg.message}
          </p>
        ))}

        <div className="lastchildDiv">
          <input
            className="messs"
            id="messs"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
          />
          <button className="send_mes" onClick={handleSendMessage}>
            Send Mess
          </button>
        </div>
      </div>
    </div>
  );
}

export default Learn;
