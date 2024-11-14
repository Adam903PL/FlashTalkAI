import { useForm } from "react-hook-form";
import registerStyles from './css/registration.module.css';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

function Registration() {
  const { register, handleSubmit } = useForm<FormData>();

  const sendData = (data: FormData) => {
  
    const updatedFormData = { email: data.email, password: data.password };

    fetch("/registerData", {
      method: "POST",
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
          window.location.href = "/login"; 
        } else {
          console.log("Registration error:", data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={registerStyles.registrationBody}>
      <div className={registerStyles.container}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit(sendData)}>
          <input type="text" placeholder="Type Email" id="email" {...register("email")} />
          <input type="password" placeholder="Type Password" id="password" {...register("password")} />
          <input type="password" placeholder="Confirm Password" id="confirmPassword" {...register("confirmPassword")} />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
