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
          console.log(data.succes,"is loged in to app")
          setLogeds(true);
        }
      });
  }, []);


  useEffect(()=>{
    
    fetch("http://localhost:4444/loginsucces",{
      credentials:"include"
    }).then(resp=>resp.json())
    .then(data=>console.log(data,"checking"))


  },[loged])

  useEffect(() => {
    if (loged && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/home");
      // w chuj wazne ^  nie  wrzucać zakomentowanego na gita 
    }
    else if (loged==false && location.pathname !== "/login" && location.pathname !== "/register") {
      console.log(loged,location.pathname)
      navigate("/login");
      // w chuj wazne ^  nie  wrzucać zakomentowanego na gita
    }
  }, [loged, location, navigate]);

  const setloged = (status: boolean) => {
    console.log(status,"ksksk")
    setLogeds(status);
  };

  const value: logedType = { loged, setloged };

  return <LogedContext.Provider value={{ islogin: value }}>{children}</LogedContext.Provider>;
};
