import { useState } from 'react';
import './css/login.css';

function Login() {


  const [formData, setFormData] = useState({ email: "", password: "" });
  formData
  const sendData = () => {
    const emailVal = (document.getElementById("email") as HTMLInputElement).value;
    const passVal = (document.getElementById("pass") as HTMLInputElement).value;

    const updatedFormData = { email: emailVal, password: passVal };
    setFormData(updatedFormData);

    fetch("/loginData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    })      .then((response) => {
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
    <div className='loginBody'>
        <div className="container">
            <h1>Login</h1>
            <input type="text" placeholder="Type Email" id="email" />
            <input type="password" placeholder="Type Password" id="pass" />
            <button onClick={sendData}>Send Data</button>
        </div>
    </div>
    
  );
}

export default Login;
