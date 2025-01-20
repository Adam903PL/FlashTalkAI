import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBars/navbar";
import { useLoged } from "../contexts/loged/useLoged";
import { FaRocket, FaBookOpen, FaRegLightbulb,FaAngleDown, Fa500Px } from 'react-icons/fa';
import { Footer } from "./NavBars/footer";
import { useSpring, animated } from 'react-spring';
const Home: React.FC = () => {
  const navigate = useNavigate()

  const fadeIn = useSpring({
    opacity: 1, 
    transform: 'translateY(0)', 
    from: { opacity: 0, transform: 'translateY(20px)' }, 
    config: { tension: 180, friction: 12 }, 
  });
  return (
  
    <div className="min-h-screen text-white">
      <NavBar />
      <div className="container mx-auto p-4">
      <animated.h1 style={fadeIn} className="text-4xl font-semibold text-center text-blue-500">
        Welcome to FlashTalkAI!
      </animated.h1>
      <animated.p style={fadeIn} className="text-xl text-center text-gray-700 mt-4">
        Your journey to mastering AI starts here.
      </animated.p>
    </div>
     {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">Ilość testów</h3>
            <p className="text-lg">12</p>

          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">Postęp</h3>
            <p className="text-lg">75% wykonanych zadań</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">Aktualny poziom</h3>
            <p className="text-lg">Średni</p>
          </div>
        </div>

        {/* Main Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div
            className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/home/learn")}
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Ucz się AI</h3>
            <p className="text-md">Rozpocznij naukę z pomocą sztucznej inteligencji!</p>
          </div>
          <div
            className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/home/voice-practice")}
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Praktyka Głosowa</h3>
            <p className="text-md">Ćwicz wymowę i poprawność z AI!</p>
          </div>
          <div
            className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/home/flashcards")}
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Fiszki</h3>
            <p className="text-md">Ucz się i powtarzaj z fiszkami!</p>
          </div>
          <div
            className="bg-gray-900 p-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/home/test")}
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Test</h3>
            <p className="text-md">Rozpocznij nowy test sprawdzający Twoją wiedzę!</p>
          </div>
        </div>
      </div>


    </div>



  );
};

export default Home;
