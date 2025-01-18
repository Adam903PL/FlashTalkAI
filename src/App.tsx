import { BrowserRouter as Router } from "react-router-dom";
import { LogedProvider } from "./contexts/loged/LogedProvider";
import MainRouter from "./router/Router";

function App() {
  return (
      <>
          <Router>
              <LogedProvider>
                  <MainRouter />
              </LogedProvider>
          </Router>
      </>
  );
}

export default App;
