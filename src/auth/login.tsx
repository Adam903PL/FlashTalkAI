import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import LoadingDots from "../assets/animations/loadingDots.json"
import { useLottie } from "lottie-react";
import Lottie from "lottie-react";
import BackgroundAnimation from "../assets/animations/backround.json"
type FormData = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [needVerCode, setneedVerCode] = useState<boolean>(false);
  const [verificationCode, setverificationCode] = useState();
  const [logData,setLogData] = useState({})

  const style = {
    height: "100vh", 
  };
  const options = {
    animationData: BackgroundAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);



  const sendData = async (data: FormData) => {
    const updatedFormData = { email: data.email, password: data.password };
    setLogData(updatedFormData)
    try {
      setLoading(true);
      await fetch("http://localhost:4444/needverification", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data, "needverify");
          if (data.needverify) {
            fetch("http://localhost:4444/generateverificationcode", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedFormData),
            })
              .then((resp) => resp.json())
              .then((data) => {
                console.log("here w posc genvercod")
                if (data.success) {
                  console.log(data.message, "this");
                  setverificationCode(data.message);
                  setneedVerCode(true);
                } else if (data.success === false) {
                  console.log(
                    "Error during generating verificationcode data succes == false"
                  );
                } else {
                  console.log("Coś się zjebało");
                }
              });
          } else {
            fetch("http://localhost:4444/loginData", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedFormData),
            })
              .then((resp) => resp.json())
              .then((data) => {
                if (data.success) {
                  setTimeout(() => {
                    console.log("Odczekano 5 sekund");
                  }, 5000); 
                  navigate("/home");
                } else {
                  setLoading(false)
                  setErrorMessage(data.message || "Nieznany błąd.");
                }
              });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const checkCodeVerification = (e) => {
    if(verificationCode == e.target.value){
      fetch("http://localhost:4444/loginData", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            navigate("/home");
          } else {
            setErrorMessage(data.message || "Nieznany błąd.");
          }
        });
    }
    else{
      console.log(e.target.value,verificationCode,"kod")
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl min-h-screen">
      <div className="bg-opacity-90 bg-gray-800 p-10 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl text-center text-white mb-8">Logowanie</h1>
        <form onSubmit={handleSubmit(sendData)} className="space-y-4">
          <input
            type="text"
            placeholder="Email Address"
            {...register("email", {
              required: "Email jest wymagany",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Nieprawidłowy format email",
              },
            })}
            className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Hasło jest wymagane" })}
            className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
          {needVerCode && (
            <div className="mt-6 bg-gray-700 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl text-white mb-4">
                Wpisz Kod Weryfikacyjny
              </h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Kod weryfikacyjny"
                  onChange={(e) => {checkCodeVerification(e)}}
                  className="w-full p-4 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            {loading ? "Trwa logowanie..." : "Zaloguj się"}
          </button>


          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </form>

        <button
          onClick={() => navigate("/forgot-password")}
          className="w-full mt-4 py-3 bg-transparent text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
        >
          🔑 Przypomnij hasło
        </button>

        <button
          onClick={() => navigate("/register")}
          className="w-full mt-4 py-3 bg-transparent text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
        >
          Nie masz konta? Zarejestruj się
        </button>
      </div>
    </div>
  );
}

export default Login;
