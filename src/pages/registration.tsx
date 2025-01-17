import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./css/registration.css";
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
  const [isPremium, setIsPremium] = useState<boolean>(false); // Stan dla Premium
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
        console.log(data);

        if (data.success) {
          console.log("Registration successful:", data.message);
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
      setShowError(false); // Ukryj komunikat o błędzie
      if (profileType === "premium") {
        setIsPremium(true); // Jeśli wybrano premium, pokazujemy formularz karty
      }
    } else {
      setShowError(true); // Pokaż komunikat o błędzie
    }
  };

  return (
    <div className="registrationBody">
      <div className="maincontainer">
        <h1 className="title">Register</h1>
        <form onSubmit={handleSubmit(sendData)}>
          {showMainData ? (
            <>
              <input
                type="text"
                placeholder="Type Email"
                id="email"
                {...register("email", {
                  required: "Email jest wymagany",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Nieprawidłowy format email",
                  },
                })}
              />
              {errors.email && (
                <span style={{ color: "red" }}>{errors.email.message}</span>
              )}

              <input
                type="password"
                placeholder="Type Password"
                id="password"
                {...register("password", { required: "Hasło jest wymagane" })}
              />
              {errors.password && (
                <span style={{ color: "red" }}>{errors.password.message}</span>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Potwierdzenie hasła jest wymagane",
                })}
              />
              {errors.confirmPassword && (
                <span style={{ color: "red" }}>
                  {errors.confirmPassword.message}
                </span>
              )}

              <div className="mt-4">
                <label className="mr-2">Profile Type:</label>
                <select
                  {...register("profileType", { required: "Wybierz typ profilu" })}
                  className="border p-2"
                >
                  <option value="normal">Normal</option>
                  <option value="premium">Premium - 10.99 USD</option>
                </select>
              </div>
              
              {errors.profileType && (
                <span style={{ color: "red" }}>{errors.profileType.message}</span>
              )}

              {showError && (
                <p className="text-red-500 mt-2">
                  Proszę wypełnić wszystkie wymagane pola.
                </p>
              )}

              <button type="button" onClick={handleNext}>
                Next
              </button>
            </>
          ) : (
            <>
              {isPremium && (
                <>
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold">Payment Information</h2>

                    <input
                      type="text"
                      placeholder="Card Number"
                      {...register("card_number", {
                        required: "Numer karty jest wymagany",
                      })}
                      className="border p-2 w-full mt-2"
                    />
                    {errors.card_number && (
                      <span style={{ color: "red" }}>{errors.card_number.message}</span>
                    )}

                    <div className="flex space-x-4">
                      <input
                        type="text"
                        placeholder="Expiration Date (MM/YY)"
                        {...register("expiration_date", {
                          required: "Data wygaśnięcia jest wymagana",
                        })}
                        className="border p-2 w-full mt-2"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        {...register("cvv", { required: "CVV jest wymagane" })}
                        className="border p-2 w-full mt-2"
                      />
                    </div>
                    {errors.expiration_date && (
                      <span style={{ color: "red" }}>{errors.expiration_date.message}</span>
                    )}
                    {errors.cvv && (
                      <span style={{ color: "red" }}>{errors.cvv.message}</span>
                    )}

                    <input
                      type="text"
                      placeholder="Billing Address"
                      {...register("billing_address", {
                        required: "Adres rozliczeniowy jest wymagany",
                      })}
                      className="border p-2 w-full mt-2"
                    />
                    {errors.billing_address && (
                      <span style={{ color: "red" }}>
                        {errors.billing_address.message}
                      </span>
                    )}

                    <select
                      {...register("card_type", { required: "Typ karty jest wymagany" })}
                      className="border p-2 w-full mt-2"
                    >
                      <option value="">Select Card Type</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                    </select>
                    {errors.card_type && (
                      <span style={{ color: "red" }}>{errors.card_type.message}</span>
                    )}
                  </div>
                </>
              )}

              <button type="submit" className="mt-4">
                Register
              </button>
            </>
          )}
        </form>
        <button className="redirectButton" onClick={() => navigate("/login")}>
          Masz konto? Zaloguj się
        </button>
      </div>
    </div>
  );
}

export default Registration;
