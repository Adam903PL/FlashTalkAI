import { useEffect, useState, type PropsWithChildren } from "react";
import { LogedContext, type logedType } from "./LogedContext";
import { useLocation, useNavigate } from "react-router-dom"; 
export const LogedProvider = ({ children }: PropsWithChildren) => {
  const [loged, setLoged] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:4444/loginsucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes) {
          setLoged(data.succes);
        }
      });
  }, []);

  const value: logedType = { loged };

  return <LogedContext.Provider value={{ islogin: value }}>{children}</LogedContext.Provider>;
};
