import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const TestPage = ({unit}:any) => {
  const [questions, setQuestions] = useState<
                  // Tutaj znowu ten taki "szablon" do pytań
    { id: number; question: string; type: "fillthegap" | "simpletranslation"; answer: string }[]
  >([]);
        // Record to takie narzędzie, które tworzy obiekty o ustalonych kluczach i wartościach, tutaj klucz jest cyfrą a wartość stringiem
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Ładowanie pytań na podstawie unitId
  useEffect(() => {
    if (unit) {
      fetch(`http://localhost:4444/api/test/${unit}`) // Uniersalna ścieżka do backendu
        .then((res) => res.json())
        .then((data) => {
          // Łączymy pytania z różnych typów zadań (w razie czego to wam wyjaśnię w szkole bo już mi się nie chce komentować)
          const allQuestions = data.test.flatMap(
            (test: { type: string; questions: any[] }) =>
              test.questions.map((q) => ({ ...q, type: test.type }))
          );
          setQuestions(allQuestions);
        })
        .catch((error) => console.error("Błąd podczas pobierania pytań:", error));
    }
  }, [unit]);

  // Obsługa wpisywania odpowiedzi
  const handleChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Klasyczny submit handler
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
      <h1>Test: {unit}</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question.id} className="question-block">
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
                placeholder="Your answer:"
                value={userAnswers[question.id] || ""}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            </div>
          ))}
          <button type="submit">Submit Your Answers</button>
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