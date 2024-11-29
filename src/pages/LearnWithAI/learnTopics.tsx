import { useEffect, useState } from "react";
import NavBar from "../navbar";
import "../css/learnAI.css";
import { useNavigate } from "react-router-dom";
import { useLoged } from "../../contexts/loged/useLoged";

function LearnTopics() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const {loged} = useLoged()
  useEffect(() => {
    if(loged == false)
      {navigate("/home")}
    else{
      NaN
    }
  }, []);



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
      <section className="levelSection">
        <h2 className="levelTitle">Level {level}</h2>
        <div className="topicsGrid">
          {topics.slice(start, end).map((topic, index) => (
            <div
              className="topicCard"
              key={index}
              onClick={() => navigate(`/home/learn/${index + 1}`)}
            >
              <h3 className="topicTitle">{`Topic ${index + 1}`}</h3>
              <p className="topicDescription">{topic.topicdescription}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <NavBar />
      <main className="learnAIPage">
        {renderTopicsByLevel(1, 0, 25)}
        {renderTopicsByLevel(2, 25, 50)}
        {renderTopicsByLevel(3, 50, 75)}
        {renderTopicsByLevel(4, 75, 100)}
      </main>
    </>
  );
}

export default LearnTopics;
