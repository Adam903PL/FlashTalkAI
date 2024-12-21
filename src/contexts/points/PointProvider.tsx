import { useEffect, useState, type PropsWithChildren } from "react";
import { PointsContext, type pointsType } from "./PointsContext";

export const PointsProvider = ({ children }: PropsWithChildren) => {
  const [list, setPoint] = useState<pointsType[]>([]);

  useEffect(() => {
    fetch("http://localhost:4444/getuserdatas", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setPoint([data]);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  },[])

  const addPoint = (userid: number) => {};

  return (
    <PointsContext.Provider value={{ list:list, addPoint }}>
      {children}
    </PointsContext.Provider>
  );
};