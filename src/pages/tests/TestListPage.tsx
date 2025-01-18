import React, { useEffect, useState } from "react";
import NavBar from "../NavBars/navbar";
import { UnitSelctComponent } from "./UnitsSelectComponent";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import LottieView, { type LottieRefCurrentProps } from "lottie-react";
import animationJson from "../../assets/Loading.json";

export const TestListPage = () => {
  const [testUnits, setTestUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    fetch("http://localhost:4444/api/test")
      .then((resp) => resp.json())
      .then((data) => {
        setLoading(false);
        setTestUnits(data);
      })
      .catch((err) => {
        console.log("Error during fetch:", err);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-800 to-black">
        <LottieView animationData={animationJson} lottieRef={lottieRef} />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-r from-gray-800 to-black min-h-screen text-white py-10">
        <div className="flex flex-wrap justify-center gap-8 mx-auto">
          {testUnits.map((unit, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-8 transition-transform duration-300 ease-in-out cursor-pointer max-w-full flex flex-col justify-center items-center hover:scale-105 hover:bg-blue-500 hover:shadow-lg"
              onClick={() => {
                const unitName = unit.split("Test.json")[0];
                navigate(`/home/test/${unitName}`);
              }}
            >
              <UnitSelctComponent unit={unit} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
