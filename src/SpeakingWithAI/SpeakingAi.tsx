import { useLocation } from "react-router-dom";

export const SpeakingAi = () => {
  const location = useLocation();
  const question = location.state?.question; // Odbieranie danych

  return (
    <div>
      <h1>Witaj na kolejnej stronie!</h1>
      <p>Otrzymane pytanie: {question}</p>
    </div>
  );
};
