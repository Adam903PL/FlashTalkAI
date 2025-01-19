import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
Modal.setAppElement('#root');

const CancelPremiumModal = ({ isOpen, closeModal }) => {


    const handleCancel = () => {
        fetch("http://localhost:4444/cancelpremiumplan",{
            credentials:"include"
        }).then(resp=>resp.json())
        .then((data)=>{
            console.log(data)
            closeModal()
            toast.success("The premium plan has been canceled")
        })
    }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Cancel Premium Plan"
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
        Are you sure you want to cancel your Premium Plan?
      </h2>

      <p className="text-center text-gray-300 mb-6">
        Cancelling your plan will remove all Premium features. This action cannot be undone.
      </p>

      <div className="flex justify-between">
        <button
          onClick={handleCancel}
          className="w-1/2 bg-red-500 hover:bg-red-600 transition-colors p-3 rounded-md text-white font-semibold"
        >
          Cancel Premium
        </button>
        <button
          onClick={closeModal}
          className="w-1/2 bg-gray-600 hover:bg-gray-700 transition-colors p-3 rounded-md text-white font-semibold"
        >
          Previous
        </button>
      </div>
    </Modal>
  );
};

export default CancelPremiumModal;
