import { useContext } from "react";
import { LogedContext } from "./LogedContext";

export const useLoged = () => {
  const context = useContext(LogedContext);

  if (!context) {
    throw new Error("useLoged must be used within a LogedProvider");
  }

  return context.islogin; 
};
