import React, { useState, useEffect } from "react";

export const TestPage = ({ unit }: { unit: string }) => {
  const [questions, setQuestions] = useState<
    { id: number; question: string; type: "fillthegap" | "simpletranslation"; answer: string }[]
  >([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Pobieranie pytań z backendu
  useEffect(() => {
    fetch(`http://localhost:4444/api/test/${unit}`) // Poprawiłem tego fetch'a
      .then((res) => res.json())
      .then((data) => {
        const allQuestions = data.test.flatMap((test: { type: string; questions: any[] }) =>
          test.questions.map((q) => ({ ...q, type: test.type }))
        );
        setQuestions(allQuestions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error has ocurred during the question downloading process", error);
        setLoading(false);
      });
  }, [unit]);

  // Handler do inputowania
  const handleChange = (id: number, type: string, value: string) => {
    const uniqueKey = `${type}-${id}`;
    setUserAnswers((prev) => ({ ...prev, [uniqueKey]: value }));
  };

  // Klasyczek 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;

    questions.forEach((question) => {
      const uniqueKey = `${question.type}-${question.id}`;
      if (
        userAnswers[uniqueKey]?.trim().toLowerCase() === question.answer.trim().toLowerCase()
      ) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
  };

  if (loading) {
    return <h2>Ładowanie testu...</h2>;
  }

  return (
    <div>
      <h1>Test: {unit}</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={`${question.type}-${question.id}`} className="question-block">
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
                value={userAnswers[`${question.type}-${question.id}`] || ""}
                onChange={(e) =>
                  handleChange(question.id, question.type, e.target.value)
                }
              />
            </div>
          ))}
          <button type="submit">Submit your answers</button>
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
