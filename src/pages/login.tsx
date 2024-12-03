import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './css/login.css';
import { useEffect, useState } from "react";
import { useLoged } from "../contexts/loged/useLoged";

type FormData = {
  email: string;
  password: string;
};

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate(); // Hook do nawigacji
  const [loading, setLoading] = useState(false); // Stan ładowania
  const [errorMessage, setErrorMessage] = useState(""); // Błąd logowania

  const {loged,setloged} = useLoged()

  

  const sendData = async (data: FormData) => {
    const updatedFormData = { email: data.email, password: data.password };

    try {
      setLoading(true); // Ustawienie stanu ładowania
      const response = await fetch("http://localhost:4444/loginData", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error("Błąd logowania: " + response.statusText);
      }

      const result = await response.json();
      if (result.success) {
        console.log("Zalogowano pomyślnie:", result.message);
        navigate("/home");
      } else {
        setErrorMessage(result.message || "Nieznany błąd.");
      }
    } catch (error) {
      setErrorMessage("Wystąpił problem z połączeniem.");
      console.error("Błąd:", error);
    } finally {
      setloged(true)
      setLoading(false); 
    }
  };

  return (
    <div className="loginBody">
      <div className="maincontainer">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit(sendData)}>
          <input
            type="text"
            placeholder="Type Email"
            id="email"
            {...register("email")}
          />
          <input
            type="password"
            placeholder="Type Password"
            id="pass"
            {...register("password")}
          />
          <button type="submit">Send Data</button>
          <button 
            type="button"
            className="forgotPasswordButton"
          >
            🔑 Przypomnij hasło
          </button>
        </form>
        <button
          className="forgotPasswordButton"
          onClick={() => navigate("/register")} 
        >
          Nie masz konta? Zarejestruj się
        </button>
      </div>
    </div>
  );
}

export default Login;
