  import { BrowserRouter as Router } from "react-router-dom";
  import { LogedProvider } from "./contexts/loged/LogedProvider";
  import MainRouter from "./router/Router";
  import { PointsProvider } from "./contexts/points/PointProvider";
  import { useLottie } from "lottie-react";
  import BackgroundAnimation from "./assets/animations/backround.json"; // Animacja JSON
  import "./index.css";
  import { Footer } from "./pages/NavBars/footer";

  function App() {

    const options = {
      animationData: BackgroundAnimation,
      loop: true,
      autoplay: true,
      rendererSettings: {
        preserveAspectRatio: "none", 
      },
    };
    

    
    const { View } = useLottie(options);

    return (
      <Router>
        <LogedProvider>
          <PointsProvider>
            {/* Główna struktura strony */}
            <div className="relative min-h-screen text-white  ">
              {/* Tło z animacją */}
              <div className="  absolute inset-0 -z-10 bg-repeat w-full h-full flex items-center justify-center">{View}</div>

              {/* Treść aplikacji */}
              <MainRouter />
            </div>
          </PointsProvider>
        </LogedProvider>
      </Router>
    );
  }

  export default App;
