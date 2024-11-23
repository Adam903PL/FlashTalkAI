import { useEffect, useState } from "react";
import NavBar from "../navbar";
import CSS from "../css/learnAI.module.css";
import { Navigate, useNavigate } from "react-router-dom";
function LearnTopics() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:4444/getAllTopics")
      .then((resp) => resp.json())
      .then((data) => {
        setTopics(data.data);
      })
      .catch((err) => console.error("Error fetching topics:", err));
  }, []);

  const renderTopicsByLevel = (level, start, end) => {
    return (
      <>
        <h2 className={CSS.levelTitle}>Level {level}</h2>
        <div className={CSS.levelSection}>
          {topics.slice(start, end).map((topic, index) => {
            let topicIndex;

            // Warunkowe obliczenie indeksu na podstawie poziomu
            if (level === 1) {
              topicIndex = index + 1;
            } else if (level === 2) {
              topicIndex = index + 1 + 25;
            } else if (level === 3) {
              topicIndex = index + 1 + 50;
            } else if (level === 4) {
              topicIndex = index + 1 + 75;
            }

            return (
              <div
                className={CSS.topicCard}
                key={index}
                onClick={() => {
                  if (topicIndex !== undefined) {
                    navigate(`/home/learn/${topicIndex}`);
                  }
                }}
              >
                <p>{topic.topicdescription}</p>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <NavBar />
      <div className={CSS.container}>
        {renderTopicsByLevel(1, 0, 25)}
        {renderTopicsByLevel(2, 25, 50)}
        {renderTopicsByLevel(3, 50, 75)}
        {renderTopicsByLevel(4, 75, 100)}
      </div>
    </>
  );
}

export default LearnTopics;
