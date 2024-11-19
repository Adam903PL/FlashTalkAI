import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../pages/home";
import Flashcards from "../pages/flashcards";
import Flashcard from "../pages/flashcard";
import Login from "../pages/login";
import Registration from "../pages/registration";
import {Levels} from "../SpeakingWithAI/SpeakingLevels";
import { SpeakingAi } from "../SpeakingWithAI/SpeakingAi";

function Router() {
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
      path: "/Speaking",
      element: <Levels />,
    },
    {
      path: "/SpeakingAi",
      element: <SpeakingAi />,
    },
  ];

  const router = createBrowserRouter(routes);


  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return <RouterProvider router={router} />;
}

export default Router;
