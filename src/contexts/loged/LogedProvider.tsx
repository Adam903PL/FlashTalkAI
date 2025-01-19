import { useEffect, useState, type PropsWithChildren } from "react";
import { LogedContext, type logedType } from "./LogedContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from '../../router/links';

export const LogedProvider = ({ children }: PropsWithChildren) => {
  const [loged, setLogeds] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    // Sprawdź, czy użytkownik jest zalogowany za pomocą jednego zapytania
    fetch("http://localhost:4444/loginsucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setLogeds(data.succes);
      })
      .catch(() => {
        setLogeds(false);
      });
  }, [location.pathname]); // Odśwież przy każdej zmianie ścieżki

  useEffect(() => {
    const protectedPaths: string[] = [
      Link.HOME,
      Link.SETTINGS,
      Link.FLASHCARDS,
      Link.FLASHCARD,
      Link.LEARN,
      Link.LEARN_AI,
      Link.TEST_LIST,
      Link.TEST
    ];

    if (loged) {
      // Jeśli zalogowany i na /login lub /register, przekieruj na /home
      if (location.pathname === Link.LOGIN || location.pathname === Link.REGISTER || location.pathname === Link.FORGOT_PASSWORD) {
        navigate(Link.HOME);
      }
    } else {
      // Jeśli nie zalogowany, a próbuje wejść na chronioną stronę
      if (protectedPaths.includes(location.pathname)) {
        navigate(Link.LOGIN);
      }
    }
  }, [loged, location.pathname, navigate]); // Używamy `loged` i `location.pathname` do sprawdzenia, gdzie jesteśmy i czy wymagane jest przekierowanie

  const setloged = (status: boolean) => {
    setLogeds(status);
  };

  const value: logedType = { loged, setloged };

  return <LogedContext.Provider value={{ islogin: value }}>{children}</LogedContext.Provider>;
};
