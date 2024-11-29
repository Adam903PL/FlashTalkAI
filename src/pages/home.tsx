import React, { useEffect } from "react";
import homeStyles from "./css/home.module.css";
import NavBar from "./navbar";
import { useNavigate } from "react-router-dom";
import { usePoint } from "../contexts/points/usePoints";
import { pointsType } from "../contexts/points/PointsContext";
import { useLoged } from "../contexts/loged/useLoged";
const Home: React.FC = () => {
  const { list, setPoint } = usePoint();

  const {loged,setloged} = useLoged()

  const navigate = useNavigate();
  useEffect(() => {
    if(loged == false)
      {navigate("/login")}
    else{
      NaN
    }
  }, []);

  
  useEffect(() => {
    console.log(list,"sd")
  }, [list]);




  return (
    <div className={homeStyles.homeContainer}>
      {/* Header */}
      <NavBar></NavBar>
      {/* Main content */}
      <div className={homeStyles.mainContainer}>
        <div className={homeStyles.userStats}>
          <div className={homeStyles.statCard}>
            <h3>Ilość testów</h3>
            <p>12</p>
          </div>
          <div className={homeStyles.statCard}>
            <h3>Postęp</h3>
            <p>75% wykonanych zadań</p>
          </div>
          <div className={homeStyles.statCard}>
            <h3>Aktualny poziom</h3>
            <p>Średni</p>
          </div>
        </div>

        <div className={homeStyles.mainOptions}>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              navigate("/home/learn");
            }}
          >
            <h3>Ucz się AI</h3>
            <p>Rozpocznij naukę z pomocą sztucznej inteligencji!</p>
          </div>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              navigate("/home/voice-practice");
            }}
          >
            <h3>Praktyka Głosowa</h3>
            <p>Ćwicz wymowę i poprawność z AI!</p>
          </div>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              navigate("/home/flashcards");
            }}
          >
            <h3>Fiszki</h3>
            <p>Ucz się i powtarzaj z fiszkami!</p>
          </div>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              navigate("/home/test");
            }}
          >
            <h3>Test</h3>
            <p>Rozpocznij nowy test sprawdzający Twoją wiedzę!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
