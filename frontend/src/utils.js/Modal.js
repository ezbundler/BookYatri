import React from 'react';

const ModalUtil = ({ isOpen, onClose, children, onSubmit }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 sm:p-6 z-[9999]"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {children}

        <div className="flex gap-4 justify-center mt-4">
          {onClose && (
            <button
              className="bg-red-500 hover:bg-white hover:border border-red-500 hover:text-red-600 text-white px-4 py-2 rounded transition"
              onClick={onClose}
            >
              Close
            </button>
          )}
          {onSubmit && (
            <button
              className="bg-slate-500 hover:bg-blue-500 text-white px-4 py-2 rounded transition"
              onClick={onSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalUtil;
