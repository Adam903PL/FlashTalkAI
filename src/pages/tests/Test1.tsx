import React, { useState, useEffect } from "react";

export const Unit1Test = () => {
  const [questions, setQuestions] = useState<
    { id: number; question: string; type: "fillthegap" | "simpletranslation"; answer: string }[]
  >([]);

  //<Record> to takie narzędzie, które pozwala tworzyć obiekt z kluczami i wartościami, tutaj klucz będzie cyfrą, a wartość stringiem
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Ładowanie pytań z backendu
  useEffect(() => {
    fetch("../../../../server/test/unit1Test.json")
      .then((res) => res.json())
      .then((data) => {
        // Wyciągamy wszystkie pytania, niezależnie od typu flatMapem, w szkole wam powiem jak to działa but for now trust me
        const allQuestions = data.test.flatMap(
          (test: { type: string; questions: any[] }) => test.questions.map((q) => ({ ...q, type: test.type }))
        );
        setQuestions(allQuestions);
      })
      .catch((error) => console.error("Błąd podczas pobierania pytań:", error));
  }, []);

  // Obsługujemy odpowiedzi użytkownika
  const handleChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Klasyczny submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;

    // Tutaj taki prosty kodzik, który sprawdza czy odp jet prawidłowa
    questions.forEach((question) => {
      if (userAnswers[question.id]?.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    //końcowe settery
    setScore(correctCount);
    setIsSubmitted(true);
  };

  return (
    <div>
      <h1>Test z Unit 1</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question.id} className="question-block">
              {/* Wyświetlamy pytania zależnie od typu (wydaje mi się, że wszystko robimy po angielskiemu, ale jakby co to piszcie)*/}
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
                //zawsze tego zapominam w formularzach xD
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

export default Unit1Test;
