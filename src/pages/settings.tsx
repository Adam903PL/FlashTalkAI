import React, { useState } from "react";
import {
  UserCircleIcon,
  LockClosedIcon,
  MailIcon,
  CreditCardIcon,
} from "@heroicons/react/solid";
import NavBar from "./NavBars/navbar";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    password: "",
    email: "",
    location: "",
    isTwoStepVerificationEnabled: false,
    accountType: "basic",
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
      cardType: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("cardDetails.")) {
      const field = name.split(".")[1];
      setSettings((prev) => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          [field]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings updated successfully!");
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen text-white flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold mb-8 text-blue-500">User Settings</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
        >
          {/* Email */}
          <div className="flex items-center gap-4">
            <MailIcon className="w-6 h-6 text-blue-400" />
            <label className="flex-1">
              Email:
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Password */}
          <div className="flex items-center gap-4">
            <LockClosedIcon className="w-6 h-6 text-blue-400" />
            <label className="flex-1">
              Password:
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Location */}
          <div className="flex items-center gap-4">
            <UserCircleIcon className="w-6 h-6 text-blue-400" />
            <label className="flex-1">
              Location:
              <input
                type="text"
                name="location"
                value={settings.location}
                onChange={handleChange}
                placeholder="Enter your location"
                className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Two-Step Verification */}
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isTwoStepVerificationEnabled"
                checked={settings.isTwoStepVerificationEnabled}
                onChange={handleChange}
                className="w-5 h-5 text-blue-500 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3">Enable Two-Step Verification</span>
            </label>
          </div>

          {/* Account Type */}
          <div>
            <label>
              Account Type:
              <select
                name="accountType"
                value={settings.accountType}
                onChange={handleChange}
                className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </label>
          </div>

          {/* Credit Card Details */}
          {settings.accountType === "premium" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-400">
                Credit Card Details
              </h2>
              <div className="flex items-center gap-4">
                <CreditCardIcon className="w-6 h-6 text-blue-400" />
                <label className="flex-1">
                  Card Number:
                  <input
                    type="text"
                    name="cardDetails.cardNumber"
                    value={settings.cardDetails.cardNumber}
                    onChange={handleChange}
                    placeholder="Enter 16-digit card number"
                    className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <label>
                Expiry Date:
                <input
                  type="text"
                  name="cardDetails.expiryDate"
                  value={settings.cardDetails.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-md text-white font-semibold"
          >
            Save Settings
          </button>
        </form>
      </div>
    </>
  );
};

export default Settings;
