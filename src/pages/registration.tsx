import { useState } from 'react';
import './css/registration.css'

function Registration(){
    const [formData, setFormData] = useState({ email: "", password: "" });
    formData

    const sendData = () => {
        console.log("coococococo")
        const emailVal = (document.getElementById("email") as HTMLInputElement).value;
        const passVal = (document.getElementById("password") as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

        if(passVal === confirmPassword){
            return 0 
        }
        console.log(emailVal,passVal,"ossl")
        const updatedFormData = { email: emailVal, password: passVal };
        console.log("19 lini")
        console.log(updatedFormData,"ksksk")
        setFormData(updatedFormData);
        console.log("22linia")

        fetch("/registerData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }) .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); 
        })
        .then((data: any) => {
          console.log(data,"cos");
      
          if (data.success) {
            console.log("Rejestracja się powiodła", data.message);
            window.location.href = "/login"; 
          } else {
            console.log("Błąd podczas rejestracji:", data.message);
          }
        })
        .catch((error) => console.error("Błąd:", error));
    };



    return (
        <div className="registrationBody">
          <div className="container">
            <h1>Register</h1>
            <input type="text" placeholder="Type Email" id="email" />
            <input type="password" placeholder="Type Password" id="password" />
            <input type="password" placeholder="Confirm Password" id="confirmPassword" />
            <button onClick={sendData}>Register</button>
          </div>
        </div>
      );
}



export default Registration