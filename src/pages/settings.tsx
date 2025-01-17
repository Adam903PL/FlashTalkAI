import React, { useState } from "react";
import { useUserSettings } from "../zustand/useUserSettings"; // Import store zustand

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
    <div className="settings-page">
      <h1>Settings</h1>
      <form onSubmit={handleSubmit} className="settings-form">
        {/* Hasło */}
        <label>
          Password:
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
          Email:
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
          Location:
          <input
            type="text"
            name="location"
            value={tempSettings.location}
            onChange={handleChange}
            placeholder="Enter your location"
          />
        </label>

        {/* Weryfikacja dwuetapowa */}
        <label>
          Two-Step Verification:
          <input
            type="checkbox"
            name="isTwoStepVerificationEnabled"
            checked={tempSettings.isTwoStepVerificationEnabled}
            onChange={handleChange}
          />
        </label>

        {/* Typ konta */}
        <label>
          Account Type:
          <select
            name="accountType"
            value={tempSettings.accountType}
            onChange={handleChange}
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </label>

        {/* Dane karty - widoczne tylko, gdy konto premium */}
        {tempSettings.accountType === "premium" && (
          <>
            <h2>Credit Card Details</h2>
            <label>
              Card Number:
              <input
                type="text"
                name="cardDetails.cardNumber"
                value={tempSettings.cardDetails.cardNumber}
                onChange={handleChange}
                placeholder="Enter 16-digit card number"
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="text"
                name="cardDetails.expiryDate"
                value={tempSettings.cardDetails.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name="cardDetails.cvv"
                value={tempSettings.cardDetails.cvv}
                onChange={handleChange}
                placeholder="3-digit CVV"
              />
            </label>
            <label>
              Billing Address:
              <input
                type="text"
                name="cardDetails.billingAddress"
                value={tempSettings.cardDetails.billingAddress}
                onChange={handleChange}
                placeholder="Enter billing address"
              />
            </label>
            <label>
              Card Type:
              <select
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
            </label>
          </>
        )}

        {/* Zapis ustawień */}
        <button type="submit" className="save-button">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
