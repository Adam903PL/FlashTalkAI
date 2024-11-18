import { useEffect, useState } from "react";
import navStyles from "./css/headerNav.module.css";
import cardStyles from "./css/card.module.css";
import Card from "./card";
import NavBar from "./navbar";
function Flashcards() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [units, setUnits] = useState<string[]>([]);

  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);
  useEffect(() => {
    fetch("http://localhost:4444/loginSucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes == false) {
          window.location.href = "/login";
          // navigate("/home");
        }
      });
  }, []);
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
      <div className={cardStyles.flashcards}>
        {units.map((data: string, index) => (
          
          <Card key={index} unit={data} />
        ))}
      </div>
    </>
  );
}

export default Flashcards;
