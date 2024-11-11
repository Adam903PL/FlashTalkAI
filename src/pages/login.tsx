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
