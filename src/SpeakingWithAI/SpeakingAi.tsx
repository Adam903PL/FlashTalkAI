import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const SpeakingAi = () => {
  const location = useLocation();
  const question = location.state?.question || "Brak pytania";
  const id = location.state?.id || "Brak ID";
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onopen = () => {
      console.log("Połączono z serwerem WebSocket.");
      console.log({socket})
      if (question) {
        ws.send(JSON.stringify({ question: question }));
      }
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("Odebrano wiadomość:", data);
        if (data?.message && isMounted) {
          setResponse(data.message);
          setMessageLog((prevLog) => [...prevLog, data.message]);
        }
      } catch (error) {
        console.error("Błąd parsowania wiadomości:", error);
      }
    };

    // ws.onclose = () => {
    //   console.log("Połączenie WebSocket zostało zamknięte.");
    // };

    ws.onerror = (error) => {
      console.error("Wystąpił błąd WebSocket:", error);
    };

    return () => {
      setIsMounted(false);
      console.log("Zamykanie połączenia WebSocket.");
      ws.close();
    };
  }, [question, id]);

  return (
    <div>
      <h1>Witaj na kolejnej stronie!</h1>
      <p>Otrzymane pytanie: {question}</p>
      <p>Odpowiedź serwera: {response || "Brak odpowiedzi"}</p>
      <h3>Log wiadomości:</h3>
      <ul>
        {messageLog.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};
