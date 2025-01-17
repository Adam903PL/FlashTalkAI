import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  profileType: "normal" | "premium";
  card_number?: string;
  expiration_date?: string;
  cvv?: string;
  billing_address?: string;
  card_type?: string;
};

function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const navigate = useNavigate();
  const [showMainData, setShowMainData] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const profileType = watch("profileType");

  const sendData = (data: FormData) => {
    const updatedFormData = {
      email: data.email,
      password: data.password,
      profileType: data.profileType,
      card_number: data.card_number,
      expiration_date: data.expiration_date,
      cvv: data.cvv,
      billing_address: data.billing_address,
      card_type: data.card_type,
    };

    fetch("http://localhost:4444/registerData", {
      method: "POST",
      credentials: "include",
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
        if (data.success) {
          navigate("/login");
        } else {
          console.log("Registration error:", data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleNext = () => {
    if (email && password && confirmPassword) {
      setShowMainData(false);
      setShowError(false);
      if (profileType === "premium") {
        setIsPremium(true);
      }
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl bg-gradient-to-r from-gray-800 to-black min-h-screen">
      <div className="bg-opacity-90 bg-gray-800 p-10 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl text-center text-white mb-8">Create Account</h1>
        <form onSubmit={handleSubmit(sendData)} className="space-y-4">
          {showMainData ? (
            <>
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

              <div className="mt-4">
                <label className="text-sm text-white">Profile Type</label>
                <select
                  {...register("profileType", { required: "Wybierz typ profilu" })}
                  className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                >
                  <option value="normal">Normal</option>
                  <option value="premium">Premium - $10.99</option>
                </select>
              </div>

              {showError && (
                <p className="text-red-500 text-sm">
                  Proszę wypełnić wszystkie wymagane pola.
                </p>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Next
              </button>
            </>
          ) : (
            <>
              {isPremium && (
                <>
                  <h2 className="text-xl text-white font-semibold mb-4">
                    Payment Information
                  </h2>

                  <input
                    type="text"
                    placeholder="Card Number"
                    {...register("card_number", {
                      required: "Numer karty jest wymagany",
                    })}
                    className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                  />
                  {errors.card_number && (
                    <span className="text-red-500 text-sm">{errors.card_number.message}</span>
                  )}

                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Expiration Date (MM/YY)"
                      {...register("expiration_date", {
                        required: "Data wygaśnięcia jest wymagana",
                      })}
                      className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      {...register("cvv", { required: "CVV jest wymagane" })}
                      className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  {errors.expiration_date && (
                    <span className="text-red-500 text-sm">{errors.expiration_date.message}</span>
                  )}
                  {errors.cvv && (
                    <span className="text-red-500 text-sm">{errors.cvv.message}</span>
                  )}

                  <input
                    type="text"
                    placeholder="Billing Address"
                    {...register("billing_address", {
                      required: "Adres rozliczeniowy jest wymagany",
                    })}
                    className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                  />
                  {errors.billing_address && (
                    <span className="text-red-500 text-sm">
                      {errors.billing_address.message}
                    </span>
                  )}

                  <select
                    {...register("card_type", { required: "Typ karty jest wymagany" })}
                    className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select Card Type</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">MasterCard</option>
                  </select>
                  {errors.card_type && (
                    <span className="text-red-500 text-sm">{errors.card_type.message}</span>
                  )}
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Register
              </button>
            </>
          )}
        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 py-3 bg-transparent text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Registration;
