import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ForgotPassComponent } from "./forgotpasscomponent";

type FormData = {
  email: string;
};

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [needVerCode, setneedVerCode] = useState<boolean>(false);
  const [verificationCode, setverificationCode] = useState();
  const [ChangePasswordDiv, setChangePasswordDiv] = useState<boolean>(false);
  const [email,setEmail] = useState<string>()
  const sendData = async (data: FormData) => {
    setEmail(data.email)
    const updatedFormData = { email: data.email };
    try {
      setLoading(true);
      await fetch("http://localhost:4444/generateverificationcode", {
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
            setverificationCode(data.message);
            setneedVerCode(true);
          } else {
            console.log("cos sie zjebało");
          }
        });
    } catch (err) {
      console.log("Error during sending verification email:", err);
    }
  };

  const navigate = useNavigate();

  const checkCodeVerification = (e) => {
    if (verificationCode == e.target.value) {
      setChangePasswordDiv(true);
    } else {
      console.log(e.target.value, verificationCode, "kod");
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl bg-gradient-to-r from-gray-800 to-black min-h-screen">
        <div className="bg-opacity-90 bg-gray-800 p-10 rounded-xl shadow-xl max-w-md w-full">
          {ChangePasswordDiv ? (
            <>
            <ForgotPassComponent email={email}/>
            </>
          ) : (
            <>
              <h1 className="text-3xl text-center text-white mb-8">
                Odzyskiwanie Hasła
              </h1>
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
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
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
                        onChange={(e) => {
                          checkCodeVerification(e);
                        }}
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
                  {loading ? "Wysyłanie kodu weryfikacyjnego..." : "Odzyskaj"}
                </button>
              </form>
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-4 py-3 bg-transparent text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                Maz konto ? Zaloguj się
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full mt-4 py-3 bg-transparent text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                Nie masz konta? Zarejestruj się
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
