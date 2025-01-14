import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const TestHub = () => {
  const [testFiles, setTestFiles] = useState<string[]>([]); // Tablica z nazwami plików JSON
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4444/api/test/")
      .then((response) => response.json())
      .then((data) => setTestFiles(data)) // Ustawiamy tablicę nazw plików
      .catch((error) => console.error("An error has ocurred:", error));
  }, []);

  // Funkcja do obsługi tej takiej nawigacji po kafelkach
  const handleTestClick = (testFile: string) => {
    const unitId = testFile.replace("Test.json", ""); // Wyciągamy unitId z nazwy pliku
    navigate(`/test/${unitId}`); // Przenosi do konkretnego testu
  };

  return (
    <div className="testGrid">
      <h1>Wybierz test</h1>
      <div className="testCards">
        {testFiles.map((testFile) => (
          <div key={testFile} className="testCard" onClick={() => handleTestClick(testFile)}>
            <h2>{testFile.replace("Test.json", "")}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestHub;
