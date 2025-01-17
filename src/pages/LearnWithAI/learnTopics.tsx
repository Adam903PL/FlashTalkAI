import { useEffect, useState } from "react";
import NavBar from "../navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { usePoint } from "../../contexts/points/usePoints";
import Lottie, { useLottie } from "lottie-react";
import loadingAnimation from "../../assets/animations/loading1.json";

const style = {
  height: 450,
};

function LearnTopics() {
  const [topics, setTopics] = useState([]);
  const { LearnWithAilist } = usePoint();
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

  const options = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  useEffect(() => {
    console.log(LearnWithAilist, "ksksk");
  }, [LearnWithAilist]);

  if (topics.length === 0) {
    return (
      <>
        <div className="bg-gradient-to-r from-gray-800 to-black min-h-screen text-white">
          <NavBar />
          {View}  
        </div>
      </>
    );
  }

  const renderTopicsByLevel = (
    level: number,
    start: number,
    end: number,
    access: boolean
  ) => {
    return (
      <section className="w-full max-w-4xl my-8 relative z-10" key={level}>
        <h2 className="text-2xl text-center text-cyan-400 uppercase tracking-wide mb-6 pb-2 border-b-2 border-cyan-400">
          Level {level}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {topics.slice(start, end).map((topic) => (
            <div
              className={`${
                topic.point > 0
                  ? "border-4 border-green-500 shadow-green-500 animate-glowKnown"
                  : "border-4 border-red-500 shadow-red-500 animate-glowUnknown"
              } bg-opacity-90 bg-gray-900 rounded-xl p-5 text-center transition-transform duration-300 cursor-pointer flex flex-col justify-between`}
              key={topic.topicid}
              onClick={() => {
                access ? navigate(`/home/learn/${topic.topicid}`) : NaN;
              }}
            >
              <h3 className="text-xl font-bold text-cyan-400 mb-3">
                Topic {topic.topicid}
              </h3>
              <p className="text-lg text-gray-300">{topic.topicdescription}</p>
            </div>
          ))}
        </div>
        {access ? (
          <div className="z-50 w-full max-w-4xl"></div>
        ) : (
          <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-10 rounded-xl shadow-xl">
            <div className="text-center text-gray-700 text-lg font-bold py-4 px-8 border-2 border-white rounded-lg bg-opacity-70 shadow-md">
              🚫 This level is not unlocked yet. Keep learning to unlock it!
            </div>
          </div>
        )}
      </section>
    );
  };

  const gaveAcces = (lvl: number) => {
    console.log(lvl, "lvls");
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
      <main className="bg-gradient-to-r from-gray-800 to-black min-h-screen text-white flex flex-col items-center p-5 min-h-screen font-sans">
        {gaveAcces(LearnWithAilist[0].level)}
      </main>
    </>
  );
}

export default LearnTopics;
