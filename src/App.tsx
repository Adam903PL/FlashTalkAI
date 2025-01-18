import { BrowserRouter as Router } from "react-router-dom";
import { LogedProvider } from "./contexts/loged/LogedProvider";
import MainRouter from "./router/Router";
import { PointsProvider } from "./contexts/points/PointProvider";
import "./index.css"
function App() {
  return (
    <Router> 
      <LogedProvider> 
          <PointsProvider>
            <div className="bg-gradient-to-r from-gray-800 to-black min-h-screen text-white">
              <MainRouter />
            </div>
          </PointsProvider>
      </LogedProvider>
    </Router>
  );
}

export default App;
