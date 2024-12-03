import { useEffect, useState } from "react";
import NavBar from "../navbar";
import "../css/learnAI.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoged } from "../../contexts/loged/useLoged";
import { usePoint } from "../../contexts/points/usePoints";

function LearnTopics() {
  const [topics, setTopics] = useState([]);
  const { list, setPoint } = usePoint();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetchowanie do getalltopics");
    fetch("http://localhost:4444/getAllTopics", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data, "thissss");
        setTopics(data.data);
      })
      .catch((err) => console.error("Error fetching topics:", err));
  }, []);

  if (list.length === 0) {
    return <div>Loading...</div>; // Możesz wyświetlić coś, gdy dane są ładowane
  }

  const renderTopicsByLevel = (
    level: number,
    start: number,
    end: number,
    access: boolean
  ) => {
    return (
      <section className="levelSection" key={level}>
        <h2 className="levelTitle">Level {level}</h2>
        <div className="topicsGrid">
          {topics.slice(start, end).map((topic) => (
            <div
              className={`topicCard ${
                topic.point > 0 ? "topicCardKnown" : "topicCardUnKnown"
              }`}
              key={topic.topicid} // Use a unique key based on topicid
              onClick={() => {
                access ? navigate(`/home/learn/${topic.topicid}`) : NaN;
              }}
            >
              <h3 className="topicTitle">{`Topic ${topic.topicid}`}</h3>
              <p className="topicDescription">{topic.topicdescription}</p>
            </div>
          ))}
        </div>
        {access ? (
          <div className="accesstrue"></div>
        ) : (
          <div className="accessfalse">
            <div className="accessfalse-message">
              🚫 This level is not unlocked yet. Keep learning to unlock it!
            </div>
          </div>
        )}
      </section>
    );
  };

  const gaveAcces = (lvl: number) => {
    console.log(lvl, "lvl");
    const topics = [];
    for (let i = 1; i <= 4; i++) {
      let j = (i - 1) * 25; // Początek zakresu dla danego poziomu
      let l = i * 25; // Koniec zakresu dla danego poziomu
  
      if (lvl >= i) {
        topics.push(renderTopicsByLevel(i, j, l, true)); 
      } else {
        topics.push(renderTopicsByLevel(i, j, l, false)); 
      }
    }
    return topics;
  };

  return (
    <>
      <NavBar />

      <main className="learnAIPage">{gaveAcces(list[0].level)}</main>
    </>
  );
}

export default LearnTopics;
