import React, { useState, useEffect } from "react";
import LottieView, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import "../css/TestListPage.css";
import animationJson from "../../assets/Loading.json";
import NavBar from "../navbar";

export const TestPage = ({ unit }: { unit: string }) => {
  const [questions, setQuestions] = useState<
    { id: number; question: string; type: "fillthegap" | "simpletranslation" | "multiplechoice"; answer: string; options?: string[] }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

        console.log("Pobrano pytania z API:", allQuestions);

        fetch(`http://localhost:4444/api/flashcards/${unit.replace("Test", "")}`)
          .then((res) => res.json())
          .then((flashcardData) => {
            console.log("Pobrano dane flashcard:", flashcardData);

            const flashcardWords = flashcardData
              .filter((item: any) => item.translation && item.word)
              .map((item: any) => ({
                word: item.word,
                translation: item.translation,
              }));

            const multipleChoiceQuestions = flashcardWords.slice(0, 8).map((item, index) => {
              const correctAnswer = item.translation;

              const incorrectAnswers = flashcardWords
                .filter((other) => other.translation !== correctAnswer)
                .map((other) => other.translation)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

              const options = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

              return {
                id: 1000 + index,
                question: `What is the correct translation of "${item.word}"?`,
                type: "multiplechoice",
                answer: correctAnswer,
                options,
              };
            });

            setQuestions([...allQuestions, ...multipleChoiceQuestions]);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Błąd przy pobieraniu danych flashcard:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Błąd przy pobieraniu pytań z API:", error);
        setLoading(false);
      });
  }, [unit]);

  const handleChange = (id: number, type: string, value: string) => {
    const uniqueKey = `${type}-${id}`;
    setUserAnswers((prev) => ({ ...prev, [uniqueKey]: value }));
  };

  const handleChoice = (id: number, answer: string) => {
    const uniqueKey = `multiplechoice-${id}`;
    setUserAnswers((prev) => ({ ...prev, [uniqueKey]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;

    questions.forEach((question) => {
      const uniqueKey = `${question.type}-${question.id}`;
      const userAnswer = userAnswers[uniqueKey]?.trim().toLowerCase();
      const correctAnswer = question.answer.trim().toLowerCase();

      if (userAnswer === correctAnswer) {
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <NavBar />
      <h1 className="test-unit">Test: {unit}</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="test-block">
          <div className="question-block">
            <h2>
              {currentQuestion.type === "fillthegap" ? (
                <>
                  Fill the gap: <span>{currentQuestion.question}</span>
                </>
              ) : currentQuestion.type === "simpletranslation" ? (
                <>
                  Translate: <span>{currentQuestion.question}</span>
                </>
              ) : (
                <>
                  Choose the correct translation for: <span>{currentQuestion.question}</span>
                </>
              )}
            </h2>
            <br />
            {currentQuestion.type === "multiplechoice" ? (
              <div className="options">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={`option-${currentQuestion.id}-${index}`}
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={userAnswers[`multiplechoice-${currentQuestion.id}`] === option}
                      onChange={() => handleChoice(currentQuestion.id, option)}
                    />
                    <label htmlFor={`option-${currentQuestion.id}-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Your answer"
                className={"test-input"}
                value={userAnswers[`${currentQuestion.type}-${currentQuestion.id}`] || ""}
                onChange={(e) => handleChange(currentQuestion.id, currentQuestion.type, e.target.value)}
              />
            )}
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
          <p>{score >= 10 ? <p>Good Job 😎</p> : <p>Nice 😀</p>}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
