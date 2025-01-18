import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  UserCircleIcon,
  LockClosedIcon,
  MailIcon,
  CreditCardIcon,
} from "@heroicons/react/solid";
import NavBar from "./NavBars/navbar";

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

const Settings: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
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
        cardType: "",
      },
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Settings updated successfully!");
  };

  const accountType = watch("accountType");

  return (
    <>
      <NavBar />
      <div className="min-h-screen text-white flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold mb-8 text-blue-500">User Settings</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
        >
          {/* Email */}
          <div className="flex items-center gap-4">
            <MailIcon className="w-6 h-6 text-blue-400" />
            <label className="flex-1">
              Email:
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </label>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
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
                rules={{ required: "Password is required" }}
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
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
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

          {/* Account Type */}
          <div>
            <label>
              Account Type:
              <Controller
                name="accountType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                )}
              />
            </label>
          </div>

          {/* Credit Card Details (only for premium users) */}
          {accountType === "premium" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-400">
                Credit Card Details
              </h2>
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
                {errors.cardDetails?.cardNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.cardDetails.cardNumber.message}
                  </span>
                )}
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label>
                    Expiry Date:
                    <Controller
                      name="cardDetails.expiryDate"
                      control={control}
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

              <label>
                Card Type:
                <Controller
                  name="cardDetails.cardType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="block w-full mt-1 p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select card type</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                    </select>
                  )}
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
