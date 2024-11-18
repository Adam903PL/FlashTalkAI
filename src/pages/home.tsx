import React, { useEffect, useState } from "react";
import homeStyles from "./css/home.module.css";
import NavBar from "./navbar";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom"

const Home: React.FC = () => {

  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:4444/loginSucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes == false) {
          window.location.href = "/login";
          // navigate('/login')
          // navigate("/home");
        }
      });
  }, []);
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
              window.location.href = "/home/learn";
            }}
          >
            <h3>Ucz się AI</h3>
            <p>Rozpocznij naukę z pomocą sztucznej inteligencji!</p>
          </div>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              window.location.href = "/home/voice-practice";
            }}
          >
            <h3>Praktyka Głosowa</h3>
            <p>Ćwicz wymowę i poprawność z AI!</p>
          </div>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              window.location.href = "/home/flashcards";
            }}
          >
            <h3>Fiszki</h3>
            <p>Ucz się i powtarzaj z fiszkami!</p>
          </div>
          <div
            className={homeStyles.optionCard}
            onClick={() => {
              window.location.href = "/home/test";
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
