import React, { useEffect, useState } from "react";
import NavBar from "../navbar";
import { UnitSelctComponent } from "./UnitsSelectComponent";
// import "../css/TestListPage.css"; 
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import LottieView, { type LottieRefCurrentProps } from "lottie-react";
import animationJson from "../../assets/Loading.json";
export const TestListPage = () => {
  const [testUnits, setTestUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate()
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    fetch("http://localhost:4444/api/test")
      .then((resp) => resp.json())
      .then((data) => {
        setLoading(false);
        setTestUnits(data);

        
      })
      .catch((err) => {
        console.log("Error during fetch:",err);
      });
  }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LottieView animationData={animationJson} lottieRef={lottieRef} />
            </div>
        );
    }

  return (
    <>
      <NavBar />
      <div className="unit-container">
        {testUnits.map((unit, index) => (
          <div key={index} className="unit-item" onClick={()=>{const unitName = unit.split("Test.json")[0];navigate(`/home/test/${unitName}`)}}>
            <UnitSelctComponent unit={unit} />
          </div>
        ))}
      </div>
    </>
  );
};