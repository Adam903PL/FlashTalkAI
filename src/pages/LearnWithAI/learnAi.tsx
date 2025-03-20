import React, { useEffect, useState, useRef } from "react";
import NavBar from "../NavBars/navbar";
import { useNavigate, useParams } from "react-router";
import { useLoged } from "../../contexts/loged/useLoged";
import Lottie, { useLottie } from "lottie-react";
import loadingAnimation from "../../assets/animations/loading1.json";

const style = {
  height: 300,
};

interface MessageType {
  message: string;
  maker: string;
  type?: string;
}

function Learn() {
  const { lesson } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection
  const connectWebSocket = () => {
    setConnecting(true);
    
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Create new connection
    socketRef.current = new WebSocket("ws://localhost:8080");

    // Connection opened
    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
      setConnecting(false);
      // Send topic info to start conversation
      socketRef.current?.send(JSON.stringify({ type: "topic", topic: { lesson } }));
    };

    // Listen for messages
    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setConversation(prev => [...prev, data]);
        setLoading(false);
        
        // Check if test is completed
        if (data.message === "Test passed" || data.message === "Test not passed") {
          setTestStatus(data.message);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    // Handle errors
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnecting(false);
    };

    // Handle connection close
    socketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed", event.code, event.reason);
      setConnecting(false);
      
      // Attempt reconnection if not deliberately closed and under max attempts
      if (!event.wasClean && reconnectAttempts < 5) {
        console.log(`Attempting to reconnect (${reconnectAttempts + 1}/5)...`);
        setReconnectAttempts(prev => prev + 1);
        setTimeout(connectWebSocket, 3000);
      }
    };
  };

  // Initialize connection
  useEffect(() => {
    connectWebSocket();
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Handle test completion
  useEffect(() => {
    if (testStatus === "Test passed") {
      // Send point to database
      fetch("http://localhost:4444/addpointlearwithai", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicid: lesson }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("Points added:", data);
          setTimeout(() => navigate("/home/learn"), 2000);
        })
        .catch((err) => console.log("Error during sending point to db:", err));
    } else if (testStatus === "Test not passed") {
      setTimeout(() => navigate("/home/learn"), 2000);
    }
  }, [testStatus]);

  // Handle message sending
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageObj = { type: "message", message, maker: "user" };
      setConversation(prev => [...prev, messageObj]);
      socketRef.current.send(JSON.stringify(messageObj));
      setMessage("");
    } else {
      setConversation(prev => [...prev, { 
        message: "Connection lost. Attempting to reconnect...", 
        maker: "FlashAI" 
      }]);
      connectWebSocket();
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Loading animation
  const options = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options, style);

  // Format message display
  const formatMessage = (msg: string) => {
    // Extract Messages_count and Errors from message if present
    const matches = msg.match(/Messages_count: (\d+), Errors: (\d+), Question: (.+)/);
    
    if (matches) {
      return (
        <>
          <div className="text-gray-400 text-sm mb-2">
            Messages left: {matches[1]} | Errors allowed: {matches[2]}
          </div>
          <div>{matches[3]}</div>
        </>
      );
    }
    
    return msg;
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-start p-5 max-w-[90vw] min-h-[80vh] m-auto bg-[rgba(30,30,30,.8)] rounded-lg shadow-lg backdrop-blur-[10px] border-[1px] border-[#333] overflow-hidden relative">
        {/* Connection status */}
        {connecting && (
          <div className="absolute top-0 left-0 w-full bg-yellow-600 p-1 text-center text-white">
            Connecting to server...
          </div>
        )}
        
        {/* Messages container */}
        <div className="flex-grow overflow-y-auto max-h-[calc(70vh-80px)] mb-16 px-2">
          {loading && conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              {View}
              <p className="text-white text-lg">Preparing your German lesson...</p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.maker === "user" 
                    ? "self-end ml-auto bg-[#0099ff] text-white rounded-tl-[15px] rounded-bl-[15px] rounded-br-[3px]" 
                    : "self-start mr-auto bg-[#333] text-white rounded-tr-[15px] rounded-bl-[3px] rounded-br-[15px]"
                } p-4 my-3 max-w-[75%] text-lg break-words shadow-md`}
              >
                {formatMessage(msg.message)}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 w-full flex items-center bg-[rgba(30,30,30,.95)] p-3 shadow-md border-t border-[#444]">
          <input
            className="w-full p-4 border-[1px] border-[#444] rounded-lg bg-[#2c2c2c] text-white text-lg focus:border-[#0099ff] focus:outline-none"
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer in German..."
            disabled={loading || !!testStatus}
          />
          <button
            className={`ml-3 p-4 bg-[#0099ff] text-white text-lg rounded-lg cursor-pointer hover:bg-[#007acc] focus:outline-none transition-colors ${
              loading || !!testStatus ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSendMessage}
            disabled={loading || !!testStatus}
          >
            Send
          </button>
        </div>
        
        {/* Test status notification */}
        {testStatus && (
          <div className={`absolute top-0 left-0 w-full p-3 text-center text-white ${
            testStatus === "Test passed" ? "bg-green-600" : "bg-red-600"
          }`}>
            {testStatus}
            <div className="text-sm mt-1">Redirecting to lesson page...</div>
          </div>
        )}
      </div>
    </>
  );
}

export default Learn;