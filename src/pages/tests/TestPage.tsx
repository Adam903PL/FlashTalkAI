import React, { useState, useEffect } from "react";
import LottieView, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import animationJson from "../../assets/Loading.json";
import NavBar from "../NavBars/navbar";

export const TestPage = ({ unit }: { unit: string }) => {
  const [questions, setQuestions] = useState<
    { id: number; question: string; type: "fillthegap" | "simpletranslation"; answer: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

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
        console.error("An error has occurred during the question downloading process", error);
        setLoading(false);
      });
  }, [unit]);

  const handleChange = (id: number, type: string, value: string) => {
    const uniqueKey = `${type}-${id}`;
    setUserAnswers((prev) => ({ ...prev, [uniqueKey]: value }));
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LottieView animationData={animationJson} lottieRef={lottieRef} />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <NavBar />
      <h1 className="text-center text-4xl font-bold mt-10">
        Test: {unit.replace("Test.json", "")}
      </h1>
      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 max-w-4xl mx-auto mt-12 p-8 rounded-lg shadow-lg"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestion.type === "fillthegap" ? (
                <>
                  Fill the gap: <span className="font-normal">{currentQuestion.question}</span>
                </>
              ) : (
                <>
                  Translate: <span className="font-normal">{currentQuestion.question}</span>
                </>
              )}
            </h2>
            <input
              type="text"
              placeholder="Your answer"
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userAnswers[`${currentQuestion.type}-${currentQuestion.id}`] || ""}
              onChange={(e) => handleChange(currentQuestion.id, currentQuestion.type, e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {currentQuestionIndex === questions.length - 1 && (
            <button
              type="submit"
              className="block w-full mt-8 bg-green-500 px-6 py-3 rounded-lg text-white hover:bg-green-600"
            >
              Submit your answers
            </button>
          )}
        </form>
      ) : (
        <div className="bg-gray-800 max-w-4xl mx-auto mt-12 p-8 rounded-lg text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-4">
            Your score: {score} / {questions.length}
          </h2>
          <p className={score >= 10 ? "text-green-400" : "text-yellow-300"}>
            {score >= 10 ? "Good Job 😎" : "Nice 😀"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
