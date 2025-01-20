import React, { useState, useEffect, useRef } from "react";
import LottieView, { LottieRefCurrentProps } from "lottie-react";
import animationJson from "../../assets/Loading.json";
import NavBar from "../NavBars/navbar";

export const TestPage = ({ unit }: { unit: string }) => {
  const [questions, setQuestions] = useState<
    {
      id: number;
      question: string;
      type: "fillthegap" | "simpletranslation" | "multiplechoice";
      answer: string;
      options?: string[];
    }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [endOfTime, setEndOfTime] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft === 0) {
      setEndOfTime(true);
      handleSubmit(new Event("submit"));
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    fetch(`http://localhost:4444/api/test/${unit}`)
      .then((res) => res.json())
      .then((data) => {
        const allQuestions = data.test.flatMap(
          (test: { type: string; questions: any[] }) =>
            test.questions.map((q) => ({ ...q, type: test.type }))
        );

        fetch(
          `http://localhost:4444/api/flashcards/${unit.replace("Test", "")}`
        )
          .then((res) => res.json())
          .then((flashcardData) => {
            const flashcardWords = flashcardData
              .filter((item: any) => item.translation && item.word)
              .map((item: any) => ({
                word: item.word,
                translation: item.translation,
              }));

            const multipleChoiceQuestions = flashcardWords
              .slice(0, 8)
              .map((item, index) => {
                const correctAnswer = item.translation;
                const incorrectAnswers = flashcardWords
                  .filter((other) => other.translation !== correctAnswer)
                  .map((other) => other.translation)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);

                const options = [correctAnswer, ...incorrectAnswers].sort(
                  () => Math.random() - 0.5
                );

                return {
                  id: 1000 + index,
                  question: `What is the correct translation of \"${item.word}\"?`,
                  type: "multiplechoice",
                  answer: correctAnswer,
                  options,
                };
              });

            setQuestions([...allQuestions, ...multipleChoiceQuestions]);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching flashcard data:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching test data:", error);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LottieView animationData={animationJson} lottieRef={lottieRef} />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen text-white">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Test: {unit.replace("Test.json", "")}
          </h1>
          <div className="text-xl font-medium text-gray-300 mb-6">
            Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </div>
        </div>

        {endOfTime ? (
          <div className="bg-gray-700 text-center p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl text-red-500 mb-4">Time is up!</h1>
            <p className="text-xl text-white">
              You scored {score} out of {questions.length} points.
            </p>
          </div>
        ) : (
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    {currentQuestion.type === "fillthegap" ? (
                      <>Fill the gap: <span className="font-normal">{currentQuestion.question}</span></>
                    ) : currentQuestion.type === "simpletranslation" ? (
                      <>Translate: <span className="font-normal">{currentQuestion.question}</span></>
                    ) : (
                      <>Choose the correct translation for: <span className="font-normal">{currentQuestion.question}</span></>
                    )}
                  </h2>

                  {currentQuestion.type === "multiplechoice" ? (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {currentQuestion.options?.map((option, index) => (
                        <div
                          key={index}
                          className={`bg-gray-800 p-6 rounded-lg border-2 cursor-pointer hover:scale-105 transition-all ${
                            userAnswers[`multiplechoice-${currentQuestion.id}`] === option
                              ? "bg-green-500 text-white border-green-600"
                              : "bg-gray-700 text-gray-200 border-gray-700 hover:bg-gray-600"
                          }`}
                          onClick={() => handleChoice(currentQuestion.id, option)}
                        >
                          <span className="text-2xl font-bold mr-4">{String.fromCharCode(65 + index)}</span>
                          <span className="text-lg">{option}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Your answer"
                      className="w-full p-4 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userAnswers[`${currentQuestion.type}-${currentQuestion.id}`] || ""}
                      onChange={(e) => handleChange(currentQuestion.id, currentQuestion.type, e.target.value)}
                    />
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="bg-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="bg-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    type="submit"
                    className="mt-8 bg-green-500 px-6 py-3 rounded-lg w-full text-white hover:bg-green-600"
                  >
                    Submit your answers
                  </button>
                )}
              </form>
            ) : (
              <div className="text-center bg-gray-700 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-4">Your score: {score} / {questions.length}</h2>
                <p className={`text-2xl ${score >= 10 ? "text-green-400" : "text-yellow-300"}`}>
                  {score >= 10 ? "Good Job 😎" : "Nice 😀"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
