import { useEffect, useState } from "react";
// import navStyles from "./css/headerNav.module.css";
// import "../css/card.css";
import Card from "./card";
import NavBar from "../navbar";
import { useNavigate } from "react-router-dom";
import { useLoged } from "../../contexts/loged/useLoged";
function Flashcards() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [units, setUnits] = useState<string[]>([]);

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);

  useEffect(() => {
    fetch("http://localhost:4444/api/flashcards", { credentials: "include" })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setUnits(data);
      })
      .catch((error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Stan units zmieniony:", units);
  }, [units]);

  return (
    <>
      <NavBar></NavBar>

      {/* Flashcards */}
      <div className="bg-gradient-to-r from-gray-800 to-black min-h-screen text-white py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {units.map((data: string, index) => (
              <Card key={index} unit={data} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Flashcards;
