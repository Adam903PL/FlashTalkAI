import { createContext } from "react";

export type logedType = {
  loged: boolean;
  setloged: (status: boolean) => void;

};

type LogedContextResult = {
  islogin: logedType;
};

export const LogedContext = createContext<LogedContextResult | null>(null);

LogedContext.displayName = "LogedContext";  // Correct name
