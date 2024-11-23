import React, {useEffect,useState} from "react";
import { useLocation } from "react-router-dom";



export const SpeakingAi = () => {
  const location = useLocation();
  const question = location.state?.question;
  const [socket,setSocket] = useState<WebSocket | null>(null);
  const [response,setResponse] = useState<string | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    setSocket(ws)

    ws.onopen = () => {
      if (question) {
        ws.send(JSON.stringify({type: "topic",topic: question}));
      }
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("wiadomość : ",data)
      setResponse(data.message);
      setMessageLog((prevLog) => [...prevLog, data.message])

    };

    ws.close = () => {
        console.log("wyjscie smoka")
    };

    ws.onerror = (error) => {
      console.error("wyjscie smoka dupa blad: ", error);
     };
     
     return () => {
      ws.close();
     }
  }, [question]);

  


  return (
    <div>
      <h1>Witaj na kolejnej stronie!</h1>
      <p>Otrzymane pytanie: {question}</p>
    </div>
  );
};
