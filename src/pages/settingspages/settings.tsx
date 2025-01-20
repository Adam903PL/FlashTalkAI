import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  UserCircleIcon,
  LockClosedIcon,
  MailIcon,
  CreditCardIcon,
} from "@heroicons/react/solid";
import NavBar from "../NavBars/navbar";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/success.json"; // Example Lottie animation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCreditCard, FaRegLightbulb, FaArrowRight } from "react-icons/fa";

import CancelPremiumModal from "../modals/ModalComp";
import DeleteAccount from "../modals/ModalDeleteAccount";
import { isObject } from "util";
import ProfilePictureUploader from "./pfpuploder";
type FormData = {
  password: string;
  email: string;
  location: string;
  isTwoStepVerificationEnabled: boolean;
  accountType: string;
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
    cardType: string;
  };
};
type typeBasicSettings = {
  email: string;
  password: string;
  twostepverification: boolean;
};
const Settings: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      location: "",
      isTwoStepVerificationEnabled: false,
      accountType: "basic",
      cardDetails: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        billingAddress: "",
        cardType: "Visa", // Default card type
      },
    },
  });

  const [isPremium, setIsPremium] = useState(false);
  const [Premium2, setPremium2] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [basicSettings, setbasicSettings] = useState<typeBasicSettings>({
    email: "",
    password: "",
    twostepverification: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [isOpen2, setIsOpen2] = useState(false);

  const openModal2 = () => setIsOpen2(true);
  const closeModal2 = () => setIsOpen2(false);

  const onSubmitBasic = (data: FormData) => {
    console.log("wywołuje się");
    console.log(data, "to");
    const { email, password, location, isTwoStepVerificationEnabled } = data;
    const basicData = {
      email,
      password,
      location,
      isTwoStepVerificationEnabled,
    };

    console.log(basicData, "important");
    toast.success("Basic settings updated successfully!");
    setShowSuccess(true);

    fetch("http://localhost:4444/changebasicsettings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(basicData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data, "here");
      })
      .catch((err) => {
        console.log("Error during change basic settings:", err);
        throw new Error(err);
      });
  };

  const onSubmitCard = (data: FormData) => {
    console.log(data.cardDetails);
    const newCreditCardData = {
      newCardNumber: data.cardDetails.cardNumber,
      newExpirationDate: data.cardDetails.expiryDate,
      newCvv: data.cardDetails.cvv,
      newBillingAddress: data.cardDetails.billingAddress,
      newCardType: data.cardDetails.cardType,
    };

    fetch("http://localhost:4444/update-credit-card", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCreditCardData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          toast.success("Card details saved successfully!");
        } else {
          toast.error("Error during change credit card data");
        }
      })
      .catch((err) => {
        console.log("Error during change credit card data:", err);
      });
  };

  const accountType = watch("accountType");

  const handleUpgradeToPremium = () => {
    setIsPremium(true);
    setShowCardDetails(true);
    toast.info("You have upgraded to Premium!");
  };

  useEffect(() => {
    fetch("http://localhost:4444/usersettings", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          const { email, password, twostepverification,profiletype } = data.data;
          console.log(data.data)
          setPremium2(profiletype === 'premium' ? true : false)
          // setValue("email", email || "");
          // setValue("password", password || "");
          // setValue("isTwoStepVerificationEnabled", twostepverification || false);
        }
      })
      .catch((err) => {
        console.error("Error in fetch:", err);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setbasicSettings((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setbasicSettings((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    console.log(basicSettings);
  }, [basicSettings]);
  return (
    <>
      <NavBar />

      <div className="min-h-screen text-white flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold mb-0 text-blue-500">User Settings</h1>
        <ProfilePictureUploader />
        <div className="w-full max-w-2xl space-y-6">
          {/* General Settings */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-blue-400">
              General Settings
            </h2>

            <div className="flex items-center gap-4">
              <MailIcon className="w-6 h-6 text-blue-400" />
              <label className="flex-1">
                Email:
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your new email"
                      className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </label>
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex items-center gap-4">
              <LockClosedIcon className="w-6 h-6 text-blue-400" />
              <label className="flex-1">
                Password:
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </label>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <UserCircleIcon className="w-6 h-6 text-blue-400" />
              <label className="flex-1">
                Location:
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your location"
                      className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </label>
            </div>

            {/* Two-Step Verification */}
            <div className="flex items-center gap-4">
              <Controller
                name="isTwoStepVerificationEnabled"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center">
                    <input
                      {...field}
                      type="checkbox"
                      className="w-5 h-5 text-blue-500 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3">Enable Two-Step Verification</span>
                  </label>
                )}
              />
            </div>

            {/* Submit Button for Basic Settings */}
            <button
              onClick={handleSubmit(onSubmitBasic)}
              className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-md text-white font-semibold"
            >
              Save Basic Settings
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-blue-400">
              Subscription Plan
            </h2>

            {!isPremium ? (
              Premium2 === true ? (
                <>
                  <div className="flex flex-col items-center space-y-6">
                    <p className="text-lg text-center text-green-400">
                      You are already on the Premium plan!
                    </p>
                    <p className="text-sm text-gray-300">
                      You can modify your credit card details by clicking below:
                    </p>

                    {/* Button to Modify Credit Card */}
                    <button
                      onClick={handleUpgradeToPremium}
                      className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-md text-white font-semibold"
                    >
                      Modify Credit Card Data
                    </button>
                    <button
                      onClick={openModal}
                      className="w-full bg-red-500 hover:bg-red-600 transition-colors p-3 rounded-md text-white font-semibold mt-4"
                    >
                      Cancel Premium Plan
                    </button>
                    <CancelPremiumModal
                      isOpen={isOpen}
                      closeModal={closeModal}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-6">
                    <p className="text-lg text-center">
                      Upgrade to Premium for just{" "}
                      <span className="text-blue-400 font-bold">
                        $10.99/month
                      </span>
                      !
                    </p>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <FaRegLightbulb className="text-yellow-400" /> More AI
                        recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <FaRegLightbulb className="text-yellow-400" />{" "}
                        Personalized corrections
                      </li>
                      <li className="flex items-center gap-2">
                        <FaRegLightbulb className="text-yellow-400" /> Increased
                        word limit
                      </li>
                    </ul>
                    <button
                      onClick={handleUpgradeToPremium}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors p-3 rounded-md text-white font-semibold"
                    >
                      Upgrade to Premium{" "}
                      <FaArrowRight className="inline ml-2" />
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="text-center space-y-6">
                <h3 className="text-lg font-semibold text-green-400">
                  Thank you for upgrading to Premium!
                </h3>
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-300">
                    Credit Card Details
                  </h4>
                  <div className="flex items-center gap-4">
                    <CreditCardIcon className="w-6 h-6 text-blue-400" />
                    <label className="flex-1">
                      Card Number:
                      <Controller
                        name="cardDetails.cardNumber"
                        control={control}
                        rules={{ required: "Card number is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter 16-digit card number"
                            className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      />
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label>
                        Expiry Date:
                        <Controller
                          name="cardDetails.expiryDate"
                          control={control}
                          rules={{ required: "Expiry date is required" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="MM/YY"
                              className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      <label>
                        CVV:
                        <Controller
                          name="cardDetails.cvv"
                          control={control}
                          rules={{ required: "CVV is required" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="CVV"
                              className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        />
                      </label>
                    </div>
                  </div>

                  <label>
                    Billing Address:
                    <Controller
                      name="cardDetails.billingAddress"
                      control={control}
                      rules={{ required: "Billing address is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Billing address"
                          className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                  </label>

                  {/* Card Type Dropdown */}
                  <label>
                    Card Type:
                    <Controller
                      name="cardDetails.cardType"
                      control={control}
                      rules={{ required: "Card type is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Visa">Visa</option>
                          <option value="MasterCard">MasterCard</option>
                          <option value="American Express">
                            American Express
                          </option>
                        </select>
                      )}
                    />
                  </label>
                </div>

                {/* Save card details button */}
                <button
                  onClick={handleSubmit(onSubmitCard)}
                  className="w-full bg-green-500 hover:bg-green-600 transition-colors p-3 rounded-md text-white font-semibold"
                >
                  Save Card Details
                </button>
              </div>
            )}
          </div>
          {/* Delete Account Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 mt-8">
            <h2 className="text-2xl font-semibold text-red-400">
              Delete Account
            </h2>
            <p className="text-sm text-gray-300">
              Deleting your account is permanent and cannot be undone. Please
              proceed with caution.
            </p>

            <button
              onClick={openModal2} // Remove the curly braces to directly call the function
              className="w-full bg-red-500 hover:bg-red-600 transition-colors p-3 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
              <FaRegLightbulb className="text-white" /> Delete My Account
            </button>
          </div>

          <DeleteAccount isOpen={isOpen2} closeModal={closeModal2} />
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Settings;
