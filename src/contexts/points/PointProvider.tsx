import { useEffect, useState, type PropsWithChildren } from "react";
import { PointsContext, type pointsType } from "./PointsContext";

export const PointsProvider = ({ children }: PropsWithChildren) => {
  const [list, setPoint] = useState<pointsType[]>([]);
  const [loged, setloged] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:4444/loginsucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        data.succes ? setloged(data.succes) : NaN;
      });
  }, []);

  useEffect(() => {
    if (loged) {
      fetch("http://localhost:4444/getuserdatas", {
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          setPoint([data]);
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [loged]);

  const addPoint = (userid: number) => {};

  return (
    <PointsContext.Provider value={{ list, addPoint, setPoint }}>
      {children}
    </PointsContext.Provider>
  );
};
