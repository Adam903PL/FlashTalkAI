import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendData = async (data: FormData) => {
    const updatedFormData = { email: data.email, password: data.password };

    try {
      setLoading(true);
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
        navigate("/home");
      } else {
        setErrorMessage(result.message || "Nieznany błąd.");
      }
    } catch (error) {
      setErrorMessage("Wystąpił problem z połączeniem.");
      console.error("Błąd:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-indigo-900 to-blue-700">
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
                message: "Nieprawidłowy format email" 
              } 
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
            <span className="text-red-500 text-sm">{errors.password.message}</span>
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
