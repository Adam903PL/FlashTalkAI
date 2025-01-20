import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
Modal.setAppElement('#root');

const DeleteAccount = ({ isOpen, closeModal }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate()
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleDeleteAccount = () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    setIsLoading(true);
  
    fetch("http://localhost:4444/delete-account", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
  
        if (data.success) {
          toast.success(data.message || "Your account has been successfully deleted.");
          closeModal(); // 
          navigate("/login"); 
        } else {
          toast.error(data.message || "Error deleting account. Please try again.");
        }
      })
      .catch((err) => {
        toast.error("Server error. Could not delete account.");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Delete Account"
      className="modal-content w-96 bg-gray-800 p-6 rounded-lg shadow-lg text-white relative"
      overlayClassName="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-semibold text-blue-400 text-center mb-4">
        Are you sure you want to delete your account?
      </h2>

      <p className="text-center text-gray-300 mb-6">
        Deleting your account is permanent and cannot be undone. Please confirm by entering your password.
      </p>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-300">
          Enter your password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 mt-1 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className={`w-1/2 ${isLoading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'} transition-colors p-3 rounded-md text-white font-semibold`}
        >
          {isLoading ? "Deleting..." : "Delete Account"}
        </button>
        <button
          onClick={closeModal}
          className="w-1/2 bg-gray-600 hover:bg-gray-700 transition-colors p-3 rounded-md text-white font-semibold"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteAccount;
