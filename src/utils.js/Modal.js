import React, { useState } from 'react';

const ModalUtil = ({ isOpen, onClose, children ,onSubmit }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Close the modal if the backdrop is clicked
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
        {children}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export  default ModalUtil;