import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ChooseLevel = ({ data }:any) => {
  const [forwarding, setForwarding] = useState(data);
  const navigate = useNavigate();

  useEffect(() => {
    setForwarding(data);
  }, [data]);

  const forwardingToAi = async () => {
    if (!forwarding || typeof forwarding !== "string") {
      console.error("Nieprawidłowe dane do przesłania.");
      alert("Dane do przesłania są niepoprawne.");
      return;
    }

    try {
      console.log("Forwarding to AI:", forwarding);
      const response = await fetch("http://localhost:4444/api/forwardToAi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: forwarding }),
      });

      if (!response.ok) {
        throw new Error(
          `Błąd serwera: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Success:", result);

      // Przekierowanie po sukcesie
      navigate("/SpeakingAi", { state: { question: forwarding } });
    } catch (error) {
      console.error("Error:", error);
      alert("Nie udało się przesłać pytania do AI. Spróbuj ponownie.");
    }
  };

  return (
    <div>
      <h1>{data}</h1>
      <button onClick={forwardingToAi}>Wyślij dalej</button>
    </div>
  );
};
