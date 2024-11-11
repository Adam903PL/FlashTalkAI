import Login from "./pages/login";
import Home from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Flashcards from "./pages/flashcards";
import Registration from "./pages/registration";

function App() {
 

  return (
    <> 
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/flashcards" element={<Flashcards/>}></Route>
            <Route path="/register" element={<Registration/>}></Route>
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
