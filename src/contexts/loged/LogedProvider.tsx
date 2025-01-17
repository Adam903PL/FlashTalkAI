import { useEffect, useState, type PropsWithChildren } from "react";
import { LogedContext, type logedType } from "./LogedContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from '../../router/links'
export const LogedProvider = ({ children }: PropsWithChildren) => {
  const [loged, setLogeds] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    // Sprawdź, czy użytkownik jest zalogowany
    fetch("http://localhost:4444/loginsucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes) {
          console.log(data.succes, "is logged in to app");
          setLogeds(true);
        }
      });
  }, [loged, location.pathname,navigate]);

  useEffect(() => {
    // Gdy loged się zmieni, ponownie sprawdź, czy użytkownik jest zalogowany
    fetch("http://localhost:4444/loginsucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data, "checking"));
  }, [loged, location.pathname,navigate]);

  useEffect(() => {
    if (loged) {
      // Jeśli zalogowany i na /login lub /register, przekieruj na /home
      if (location.pathname === "/login" || location.pathname === "/register") {
        navigate("/home");
        
      }
    } else {
      if (location.pathname in Link) {
        console.log(loged, location.pathname,"hwy");
        navigate("/login");
      }
    }
    }, [loged, location.pathname,navigate]);

  const setloged = (status: boolean) => {
    console.log(status, "changing login status");
    setLogeds(status);
  };

  const value: logedType = { loged, setloged };

  return <LogedContext.Provider value={{ islogin: value }}>{children}</LogedContext.Provider>;
};
