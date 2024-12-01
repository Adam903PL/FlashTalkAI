import { BrowserRouter } from "react-router-dom";
import { LogedProvider } from "./contexts/loged/LogedProvider";
import { PointsProvider } from "./contexts/points/PointProvider";
import Router from "./router/Router";

function App() {
  return (
      <LogedProvider>
        <PointsProvider>
          <Router />
        </PointsProvider>
      </LogedProvider>
  );
}

export default App;
