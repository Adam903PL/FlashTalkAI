import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormData = {
  password: string;
  confirmPassword: string;
};

export const ForgotPassComponent = ({ email }: { email: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  const sendData2 = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Hasła muszą być identyczne",
      });
      return;
    } else {
      setLoading(true);
      const updatedFormData = { email: email, password: data.password };
      try {
        const response = await fetch("/changepassword", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        });
        const result = await response.json();
        if (result.success) {
          console.log("Hasło zmienione pomyślnie");
          navigate("/login")
        } else {
          console.log("Błąd podczas zmiany hasła");
        }
      } catch (err) {
        console.log("Błąd podczas zmiany hasła", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center text-white mb-8">Nowe Hasło</h1>
      <form onSubmit={handleSubmit(sendData2)} className="space-y-4">
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Hasło jest wymagane" })}
          className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password.message}</span>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Potwierdzenie hasła jest wymagane",
          })}
          className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          {loading ? "Wysyłanie kodu weryfikacyjnego..." : "Odzyskaj"}
        </button>
      </form>
    </>
  );
};