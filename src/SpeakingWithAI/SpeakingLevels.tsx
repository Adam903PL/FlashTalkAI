import { useEffect, useState } from "react";
import { ChooseLevel } from "./ChooseLevel";

type Subject = {
  id: number;
  question: string;
};

export const Levels = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("http://localhost:4444/api/tematData")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Debugowanie danych z API
        setSubjects(data.data || []); // Ustaw dane z klucza `data`
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSubjects([]); // W przypadku błędu ustaw pustą tablicę
      });
  }, []);

  return (
    <div>
      {subjects.length > 0 ? (
        <ul>
          {subjects.map((subject) => (
            <ChooseLevel data={subject.question}/>
          ))}
        </ul>
      ) : (
        <p>Ładowanie Poziomów</p>
      )}
    </div>
  );
};
