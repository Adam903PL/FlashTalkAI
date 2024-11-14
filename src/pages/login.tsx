
import { useForm } from "react-hook-form"
import loginStyles from './css/login.module.css';


type FormData = {
  "email":string,
  "password":string
}

function Login() {


  // const [formData, setFormData] = useState({ email: "", password: "" });

  const {register,handleSubmit} = useForm<FormData>({})


  const sendData = (data:any) => {

    const updatedFormData = { email: data.email, password:data.password  };
    


    fetch("/loginData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); 
    })
    .then((data: any) => {
      console.log(data, "sadas");
  
      if (data.success) {
        console.log("Zalogowano pomyślnie:", data.message);
        window.location.href = "/home"; 
      } else {
        console.log("Błąd logowania:", data.message);
      }
    })
    .catch((error) => console.error("Błąd:", error));
};
  return (
    <div className={loginStyles.loginBody}>
        <div className={loginStyles.container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(sendData)}>
            <input type="text" placeholder="Type Email" id="email"  {...register("email")} />
            
            <input type="password" placeholder="Type Password" id="pass"  {...register("password")} />
            <button type='submit'>Send Data</button>
            </form>
        </div>
    </div>
    
  );
}

export default Login;
