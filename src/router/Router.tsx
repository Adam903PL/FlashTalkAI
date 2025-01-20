import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../pages/home";
import Flashcards from "../pages/flashcards/flashcards";
import Flashcard from "../pages/flashcards/flashcard";
import Login from "../auth/login";
import Registration from "../auth/registration";
import LearnTopics from "../pages/LearnWithAI/learnTopics";
import LearnAi from "../pages/LearnWithAI/learnAi";
import TestPage from "../pages/tests/TestPage";
import { TestListPage } from "../pages/tests/TestListPage";
import { Link } from './links';
import NotFound from '../pages/errors/NotFound'
import Settings from "../pages/settingspages/settings";
import { ForgotPassword } from "../auth/forgotpassword";
function MainRouter() {
  const [units, setUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [testUnits, setTestUnits] = useState<string[]>([]); 
  const [isTestUnitsLoaded, setIsTestUnitsLoaded] = useState(false); 

  // Fetch flashcards data
  useEffect(() => {
    fetch("http://localhost:4444/api/flashcards", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch test units data
  useEffect(() => {
    fetch("http://localhost:4444/api/test/", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTestUnits(data);
        setIsTestUnitsLoaded(true);
      });
  }, []);

  // if (loading || !isTestUnitsLoaded) {
  //   return <div>Ładowanie...</div>;
  // }

  return (
    <Routes>
      <Route path={Link.HOME} element={<Home />} />
      <Route path={Link.FLASHCARDS} element={<Flashcards />} />
      
      {/* Generate dynamic flashcard routes */}
      {units.map((unit, index) => (
        <Route
          key={index}
          path={Link.FLASHCARD.replace(':unit', unit.replace(".json", ""))}
          element={<Flashcard unit={unit} />}
        />
      ))}
      
      <Route path={Link.LOGIN} element={<Login />} />
      <Route path={Link.REGISTER} element={<Registration />} />
      <Route path={Link.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
      <Route path={Link.LEARN} element={<LearnTopics />} />
      <Route path={Link.LEARN_AI} element={<LearnAi />} />

      {/* Generate dynamic test routes */}
      <Route path={Link.TEST_LIST} element={<TestListPage />} />
      {testUnits.map((unit, index) => (
        <Route
          key={index}
          path={Link.TEST.replace(':unit', unit.replace("Test.json", ""))}
          element={<TestPage unit={unit} />}
        />
      ))}
      <Route path={Link.SETTINGS} element={<Settings/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MainRouter;
