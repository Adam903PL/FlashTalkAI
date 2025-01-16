import { useEffect, useState, type PropsWithChildren } from "react";
import { PointsContext, type pointsType } from "./PointsContext";
import { useLoged } from "../loged/useLoged";

export const PointsProvider = ({ children }: PropsWithChildren) => {
  const [LearnWithAilist, setLearnWithAilist] = useState<pointsType[]>([]);
  const {loged} = useLoged()
  useEffect(() => {
    if(loged){
      fetch("http://localhost:4444/getuserdatas", {
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data,"hereMain")
          setLearnWithAilist([data]);
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  },[loged])

  const addPoint = (userid: number) => {};

  return (
    <PointsContext.Provider value={{ LearnWithAilist:LearnWithAilist, addPoint }}>
      {children}
    </PointsContext.Provider>
  );
};