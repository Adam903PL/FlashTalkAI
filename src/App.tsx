import Login from "./pages/login";
import Home from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Flashcards from "./pages/flashcards";
import Registration from "./pages/registration";
import { useEffect, useState } from "react";
import Flashcard from "./pages/flashcard";

interface Unit {
  name: string;
}

function App() {
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetch("/api/flashcards")
      .then((resp) => resp.json())
      .then((data) => {
        setUnits(data); 
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/flashcards" element={<Flashcards />} />
          {units.map((unit:any, index) => (
            <Route
              key={index}
              path={`/home/flashcards/${unit.replace(".json", "")}`}
              element={<Flashcard unit={unit}/>}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
