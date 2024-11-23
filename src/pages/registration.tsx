import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import registerStyles from './css/registration.module.css';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

function Registration() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const sendData = (data: FormData) => {
    const updatedFormData = { email: data.email, password: data.password };

    fetch("http://localhost:4444/registerData", {
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
      .then((data) => {
        console.log(data);

        if (data.success) {
          console.log("Registration successful:", data.message);
          navigate("/login"); // Przeniesienie do strony logowania
        } else {
          console.log("Registration error:", data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={registerStyles.registrationBody}>
      <div className={registerStyles.container}>
        <h1 className={registerStyles.title}>Register</h1>
        <form onSubmit={handleSubmit(sendData)}>
          <input type="text" placeholder="Type Email" id="email" {...register("email")} />
          <input type="password" placeholder="Type Password" id="password" {...register("password")} />
          <input type="password" placeholder="Confirm Password" id="confirmPassword" {...register("confirmPassword")} />
          <button type="submit">Register</button>
        </form>
        <button
          className={registerStyles.redirectButton}
          onClick={() => navigate("/login")}
        >
          Masz konto? Zaloguj się
        </button>
      </div>
    </div>
  );
}

export default Registration;
