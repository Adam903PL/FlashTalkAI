import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../pages/home";
import Flashcards from "../pages/flashcards/flashcards";
import Flashcard from "../pages/flashcards/flashcard";
import Login from "../pages/login";
import Registration from "../pages/registration";
import LearnTopics from "../pages/LearnWithAI/learnTopics";
import LearnAi from "../pages/LearnWithAI/learnAi";
import TestPage from "../pages/tests/TestPage";
import { TestListPage } from "../pages/tests/TestListPage";

function MainRouter() {
  const [units, setUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [testUnits, setTestUnits] = useState<string[]>([]); 
  const [isTestUnitsLoaded, setIsTestUnitsLoaded] = useState(false); 

  // Fetch flashcards data
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

  // Fetch test units data
  useEffect(() => {
    fetch("http://localhost:4444/api/test/", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {

        
        setTestUnits(data);
        setIsTestUnitsLoaded(true);
      });
  }, []);

  if (loading || !isTestUnitsLoaded) {
    return <div>Ładowanie...</div>;
  }

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/home/flashcards" element={<Flashcards />} />
      
      {/* Generate dynamic flashcard routes */}
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

      {/* Generate dynamic test routes */}
      <Route path="/home/test" element={<TestListPage/>}/>
      {testUnits.map((unit, index) => (
        <Route
          key={index}
          path={`/home/test/${unit.replace("Test.json","")}`}
          element={<TestPage unit={unit} />}
        />
      ))}
    </Routes>
  );
}

export default MainRouter;
