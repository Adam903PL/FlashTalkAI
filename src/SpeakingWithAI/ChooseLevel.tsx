import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChooseLevel = ({ data }) => {
  const [forwarding, setForwarding] = useState(data);
  const navigate = useNavigate(); // Hook do nawigacji

  const forwardingToAi = () => {
    
    console.log("Forwarding to AI:", forwarding);
    fetch("http://localhost:4444/api/forwardToAi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: forwarding }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      navigate("/SpeakingAi", { state: { question: forwarding } });
  };

  return (
    <div>
      <h1>{data}</h1>
      <button onClick={forwardingToAi}>Wyślij dalej</button>
    </div>
  );
};
