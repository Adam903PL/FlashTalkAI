import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../pages/home";
import Flashcards from "../pages/flashcards";
import Flashcard from "../pages/flashcard";
import Login from "../pages/login";
import Registration from "../pages/registration";
import {Levels} from "../SpeakingWithAI/SpeakingLevels";
import { SpeakingAi } from "../SpeakingWithAI/SpeakingAi";
import LearnTopics from "../pages/LearnWithAI/learnTopics";
import LearnAi from "../pages/LearnWithAI/learnAi";

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

<<<<<<< HEAD
  const unitRoutes: RouteObject[] = units.map((unit, index) => ({
    path: `/home/flashcards/${unit.replace(".json", "")}`,
    element: <Flashcard key={index} unit={unit} />,
  }));

  const routes: RouteObject[] = [
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/home/flashcards",
      element: <Flashcards />,
    },
    ...unitRoutes,
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Registration />,
    },
    {
      path: "/home/learn",
      element: <LearnTopics/>
    },
     {
      path: "/home/learn/:lesson", 
      element: <LearnAi /> 
    },
    {
      path: "/Speaking",
      element: <Levels />,
    },
    {
      path: "/SpeakingAi",
      element: <SpeakingAi />,
    },
  ];

  const router = createBrowserRouter(routes);


=======
>>>>>>> 59f9e74d5da378949ae9bc7afbae838f9e331d4c
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
    </Routes>
  );
}

export default MainRouter;
