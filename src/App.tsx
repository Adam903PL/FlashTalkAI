import { BrowserRouter as Router } from "react-router-dom";
import { LogedProvider } from "./contexts/loged/LogedProvider";
import { PointsProvider } from "./contexts/points/PointProvider";
import MainRouter from "./router/Router";

function App() {
  return (
    <Router> 
      <LogedProvider> 
        <PointsProvider>
          <MainRouter />
        </PointsProvider>
      </LogedProvider>
    </Router>
  );
}

export default App;
