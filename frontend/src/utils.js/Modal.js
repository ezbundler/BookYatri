import React from "react";

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
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] relative overflow-y-auto">
        {/* Close Icon */}
        {onClose && (
          <button
          onClick={onClose}
          className="absolute top-2 right-4 w-8 h-8 rounded-full text-gray-500 hover:text-red-600 text-4xl font-bold   flex items-center text-center justify-center"
          aria-label="Close"
        >
          &times;
        </button>
        
        )}

        {children}

        {/* Submit Button */}
        {onSubmit && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-slate-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalUtil;
