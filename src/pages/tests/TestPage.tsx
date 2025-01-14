import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const TestPage = () => {
  const { unitId } = useParams<{ unitId: string }>(); // Pobranie unitId z paramsów URL
  const [questions, setQuestions] = useState<
    { id: number; question: string; type: "fillthegap" | "simpletranslation"; answer: string }[]
  >([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Ładowanie pytań na podstawie unitId
  useEffect(() => {
    if (unitId) {
      // Ładujemy odpowiedni plik .json
      fetch(`http://localhost:4444/api/test/${unitId}Test.json`)
        .then((res) => res.json())
        .then((data) => {
          const allQuestions = data.test.flatMap(
            (test: { type: string; questions: any[] }) =>
              test.questions.map((q) => ({ ...q, type: test.type }))
          );
          setQuestions(allQuestions);
        })
        .catch((error) => console.error("An error has occured during the loading process:", error));
    }
  }, [unitId]);

  // Handler odpowiadania
  const handleChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handler wysyłania testu
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;

    questions.forEach((question) => {
      if (userAnswers[question.id]?.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
  };

  return (
    <div>
      <h1>Test: {unitId}</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question.id} className="questionBlock">
              <h2>
                {question.type === "fillthegap" ? (
                  <>
                    Fill the gap: <span>{question.question}</span>
                  </>
                ) : (
                  <>
                    Translate: <span>{question.question}</span>
                  </>
                )}
              </h2>
              <input
                type="text"
                placeholder="Your answer"
                value={userAnswers[question.id] || ""}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            </div>
          ))}
          <button type="submit">Submit Your answers</button>
        </form>
      ) : (
        <div>
          <h2>
            Your score: {score} / {questions.length}
          </h2>
        </div>
      )}
    </div>
  );
};

export default TestPage;
