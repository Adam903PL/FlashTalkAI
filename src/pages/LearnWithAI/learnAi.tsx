import React, { useEffect, useState, useRef } from "react";
import NavBar from "../NavBars/navbar";
import { useNavigate, useParams } from "react-router";
import { useLoged } from "../../contexts/loged/useLoged";
import Lottie, { useLottie } from "lottie-react";
import loadingAnimation from "../../assets/animations/loading1.json"

const style = {
  height: 450,
};

function Learn() {
  let topic = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<{ message: string; maker: string }[]>([]);
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
    if (conversation[conversation.length - 1]?.message == "Test passed") {
      fetch("http://localhost:4444/addpointlearwithai", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicid: topic }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("Error during sending point to db:", err));
      navigate("/home/learn");
    }
  }, [conversation]);

  const options = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  if (conversation.length === 0) {
    return (
      <>
        <NavBar />
        <div className="flex flex-col justify-start p-5 max-w-[90vw] min-h-[80vh] m-auto bg-[rgba(30,30,30,.8)] rounded-lg shadow-lg backdrop-blur-[10px] border-[1px] border-[#333] overflow-y-auto max-h-[70vh] relative">
          {View}
          <div className="absolute bottom-0 left-0 w-full flex items-center bg-[rgba(30,30,30,.95)] p-2 shadow-md">
            <input
              className="w-full p-3 m-3 border-[1px] border-[#333] rounded-lg bg-[#2c2c2c] text-white text-lg focus:border-[#0099ff]"
              disabled
              placeholder="Wpisz wiadomość..."
            />
            <button className="p-3 bg-[#333] text-white text-lg rounded-lg cursor-pointer hover:bg-[#0099ff] hover:border-[#0099ff] focus:outline-none">
              Send Mess
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="flex flex-col justify-start p-5 max-w-[90vw] min-h-[80vh] m-auto bg-[rgba(30,30,30,.8)] rounded-lg shadow-lg backdrop-blur-[10px] border-[1px] border-[#333] overflow-y-auto max-h-[70vh] relative">
        {conversation.map((msg, index) => (
          <p
            key={index}
            className={`${
              msg.maker === "user" ? "self-end bg-[#0099ff] text-white rounded-tl-[15px] rounded-br-[15px]" : "self-start bg-[#333] text-white rounded-tl-[15px] rounded-br-[15px]"
            } p-3 m-3 max-w-[75%] text-lg break-words shadow-md`}
          >
            <strong>{msg.maker}: </strong>
            {msg.message}
          </p>
        ))}

        <div className="absolute bottom-0 left-0 w-full flex items-center bg-[rgba(30,30,30,.95)] p-2 shadow-md">
          <input
            className="w-full p-3 m-3 border-[1px] border-[#333] rounded-lg bg-[#2c2c2c] text-white text-lg focus:border-[#0099ff]"
            id="messs"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
          />
          <button
            className="p-3 bg-[#333] text-white text-lg rounded-lg cursor-pointer hover:bg-[#0099ff] hover:border-[#0099ff] focus:outline-none"
            onClick={handleSendMessage}
          >
            Send Mess
          </button>
        </div>
      </div>
    </div>
  );
}

export default Learn;
