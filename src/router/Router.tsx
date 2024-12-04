import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../pages/home";
import Flashcards from "../pages/flashcards";
import Flashcard from "../pages/flashcard";
import Login from "../pages/login";
import Registration from "../pages/registration";
import LearnTopics from "../pages/LearnWithAI/learnTopics";
import LearnAi from "../pages/LearnWithAI/learnAi";
import { Levels } from "../SpeakingWithAI/SpeakingLevels";
import SpeakingAi from "../SpeakingWithAI/SpeakingAi";

function MainRouter() {
  const [units, setUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4444/api/flashcards", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/home/flashcards" element={<Flashcards />} />
      {units.map((unit, index) => (
        <Route
          key={index}
          path={`/home/flashcards/${unit.replace(".json", "")}`}
          element={<Flashcard unit={unit} />}
        />
      ))}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/home/learn" element={<LearnTopics />} />
      <Route path="/home/learn/:lesson" element={<LearnAi />} />
      <Route path="/home/Speak" element={<Levels />} />
      <Route path="/home/SpeakingAi" element={<SpeakingAi />} />
    </Routes>
  );
}

export default MainRouter;
