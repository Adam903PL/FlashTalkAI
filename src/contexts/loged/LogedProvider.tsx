import { useEffect, useState, type PropsWithChildren } from "react";
import { LogedContext, type logedType } from "./LogedContext";
import { useNavigate, useLocation } from "react-router-dom";

export const LogedProvider = ({ children }: PropsWithChildren) => {
  const [loged, setLogeds] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation(); 

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

  useEffect(() => {
    if (loged && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/home");
    }
    else if (!loged && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login");
    }
  }, [loged, location, navigate]);

  const setloged = (status: boolean) => {
    setLogeds(status);
  };

  const value: logedType = { loged, setloged };

  return <LogedContext.Provider value={{ islogin: value }}>{children}</LogedContext.Provider>;
};
