import { useContext } from "react";
import { PointsContext } from "./PointsContext";

export const usePoint = () => {
  const context = useContext(PointsContext);

  if (!context) {
    throw new Error("usePoint must be used within a PointsProvider");
  }

  return context;
};
