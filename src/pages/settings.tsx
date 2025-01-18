import React, { useState } from "react";
import { useUserSettings } from "../zustand/useUserSettings"; // Import store zustand
import "../pages/css/settings.css"
import NavBar from "./navbar.tsx";

const Settings: React.FC = () => {
  const {
    password,
    email,
    location,
    isTwoStepVerificationEnabled,
    accountType,
    cardDetails,
    updateSettings,
  } = useUserSettings();

  const [tempSettings, setTempSettings] = useState({
    password,
    email,
    location,
    isTwoStepVerificationEnabled,
    accountType,
    cardDetails: cardDetails || {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
      cardType: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("cardDetails.")) {
      const field = name.split(".")[1]; // Wyciągnięcie właściwości karty
      setTempSettings((prev) => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          [field]: value,
        },
      }));
    } else {
      setTempSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    alert("Settings updated successfully!");
  };

  return (
      <>
      <NavBar/>

    <div className="settings-page">
      <h1 className={"settings"} >Settings</h1>
      <form onSubmit={handleSubmit} className="settings-form">
        {/* Hasło */}
        <h1 className={"topic"}>Sensitive data</h1>
        <label>
          <h3 className="password">Password:</h3>
          <input
            type="password"
            name="password"
            value={tempSettings.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </label>

        {/* Email */}
        <label>
          <h3 className="email">Email:</h3>
          <input
            type="email"
            name="email"
            value={tempSettings.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </label>

        {/* Lokalizacja */}
        <label>
          <h3 className="location">Location:</h3>
          <input className={"location-input"}
            type="text"
            name="location"
            value={tempSettings.location}
            onChange={handleChange}
            placeholder="Enter your location"
          />
        </label> <br/>

        <hr className="separation"/>

        {/* Weryfikacja dwuetapowa */}
        <h1 className={"topic"}>Security option</h1>
        <span className={"Two-Step-Verification-whole"}>
          <h3 className="Two-Step-Verification">Two-Step Verification:</h3>
          <input
            className="Two-Step-Verification-Input"
            type="checkbox"
            name="isTwoStepVerificationEnabled"
            checked={tempSettings.isTwoStepVerificationEnabled}
            onChange={handleChange}
          />
        </span> <br/>

        <hr className={"separation"}/>

        {/* Typ konta */}
        <h1 className={"topic"}>Account Type</h1>
        <span className="Account-Type-Whole">
          <h3 className="Account-Type">Change account type:</h3>
          <select
            className="Account-Type-Input"
            name="accountType"
            value={tempSettings.accountType}
            onChange={handleChange}
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </span> <br/>

        {/* Dane karty - widoczne tylko, gdy konto premium */}
        {tempSettings.accountType === "premium" && (
          <div className="Credit-Card-Details-Whole">
            <h2 className="Credit-Card-Details">Credit Card Details</h2>
            <label >
              <div className="separation-title">Card Number:</div>
              <input
                className={"Card-Number"}
                type="text"
                name="cardDetails.cardNumber"
                value={tempSettings.cardDetails.cardNumber}
                onChange={handleChange}
                placeholder="Enter 16-digit card number"
              />
            </label> <br/>
            <label >
              <div className="separation-title">Expiry Date:</div>
              <input
                className={"Expiry-Date"}
                type="text"
                name="cardDetails.expiryDate"
                value={tempSettings.cardDetails.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </label> <br/>
            <label >
              <div className="separation-title">CVV:</div>
              <input
                className={"CVV"}
                type="text"
                name="cardDetails.cvv"
                value={tempSettings.cardDetails.cvv}
                onChange={handleChange}
                placeholder="3-digit CVV"
              />
            </label> <br/>
            <label >
              <div className="separation-title">Billing Address:</div>
              <input
                className={"Billing-Address"}
                type="text"
                name="cardDetails.billingAddress"
                value={tempSettings.cardDetails.billingAddress}
                onChange={handleChange}
                placeholder="Enter billing address"
              />
            </label> <br/>
            <label className={"Card-Type-Whole"}>
              Card Type:
              <select
                className="Card-Type"
                name="cardDetails.cardType"
                value={tempSettings.cardDetails.cardType}
                onChange={handleChange}
              >
                <option value="">Select card type</option>
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="American Express">American Express</option>
                <option value="Discover">Discover</option>
              </select>
            </label> <br/>
          </div>
        )}

        <hr className="separation"/>

        {/* Zapis ustawień */}
        <button type="submit" className="save-button">
          Save Settings
        </button>
      </form>
    </div>
  </>
  );
};

export default Settings;
