import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ChooseLevel = ({ data }: any) => {
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

    navigate("/Home/SpeakingAi", { state: { question: forwarding } });
  };

  return (
    <div>
      <h1>{data}</h1>
      <button onClick={forwardingToAi}>Wybierz</button>
    </div>
  );
};
