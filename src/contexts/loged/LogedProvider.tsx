import { useEffect, useState, type PropsWithChildren } from "react";
import { LogedContext, type logedType } from "./LogedContext";


export const LogedProvider = ({ children }: PropsWithChildren) => {
  const [loged, setLogeds] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:4444/loginsucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes) {
          setLogeds(data.succes);
        }
      });
  }, []);

  // Funkcja do zmiany stanu logowania
  const setloged = (status: boolean) => {
    setLogeds(status);
  };

  const value: logedType = { loged, setloged };


  return <LogedContext.Provider value={{ islogin: value }}>{children}</LogedContext.Provider>;
};
