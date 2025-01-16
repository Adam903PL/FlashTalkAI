import React, { useState, useEffect } from "react";
import LottieView, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import "../css/TestListPage.css";
import animationJson from "../../assets/Loading.json";
import NavBar from "../navbar";

export const TestPage = ({ unit }: { unit: string }) => {
  const [questions, setQuestions] = useState<
      { id: number; question: string; type: "fillthegap" | "simpletranslation"; answer: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Dodano stan do śledzenia indeksu pytania
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  // Pobieranie pytań z backendu
  useEffect(() => {
    fetch(`http://localhost:4444/api/test/${unit}`)
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

  // Przejście do następnego pytania
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Powrót do poprzedniego pytania
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Zatwierdzenie odpowiedzi
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
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <LottieView animationData={animationJson} lottieRef={lottieRef} />
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex]; // Pobierz aktualne pytanie

  return (
      <div>
        <NavBar/>
        <h1 className="test-unit">Test: {unit}</h1>
        {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="test-block">
              <div className="question-block">
                <h2>
                  {currentQuestion.type === "fillthegap" ? (
                      <>
                        Fill the gap: <span>{currentQuestion.question}</span>
                      </>
                  ) : (
                      <>
                        Translate: <span>{currentQuestion.question}</span>
                      </>
                  )}
                </h2>
                <br/>
                <input
                    type="text"
                    placeholder="Your answer"
                    className={"test-input"}
                    value={userAnswers[`${currentQuestion.type}-${currentQuestion.id}`] || ""}
                    onChange={(e) => handleChange(currentQuestion.id, currentQuestion.type, e.target.value)}
                />
              </div>
              <div className="navigation-buttons">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="Prev"
                >
                  Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="Next"
                >
                  Next
                </button>
              </div>
              {currentQuestionIndex === questions.length - 1 && (
                  <button type="submit">Submit your answers</button>
              )}
            </form>
        ) : (
            <div className={"test-score"}>
              <h2>
                Your score: {score} / {questions.length}
              </h2>
              <p>{score >= 10 ? (
                  <p>Good Job 😎</p>
              ) : (
                  <p>Nice 😀</p>
              )}</p>
            </div>
        )}
      </div>
  );
};

export default TestPage;
