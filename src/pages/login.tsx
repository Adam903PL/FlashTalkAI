import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import  './css/login.css';

type FormData = {
  email: string;
  password: string;
};

function Login() {
  const { register, handleSubmit } = useForm<FormData>({});
  const navigate = useNavigate(); // Hook do nawigacji

  const sendData = (data: any) => {
    const updatedFormData = { email: data.email, password: data.password };

    fetch("http://localhost:4444/loginData", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: any) => {
        console.log(data);
        if (data.success) {
          console.log("Zalogowano pomyślnie:", data.message);
          navigate("/home");
        } else {
          console.log("Błąd logowania:", data.message);
        }
      })
      .catch((error) => console.error("Błąd:", error));
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
