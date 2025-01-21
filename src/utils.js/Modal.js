import React from 'react';

const ModalUtil = ({ isOpen, onClose, children ,onSubmit }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
   
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900  bg-opacity-50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white  p-6 rounded-lg shadow-lg w-3/4 gap-2 flex flex-col">
        {children}
        <div className='flex gap-4 justify-center'>
        { onClose&&<button
          className="mt-4 bg-red-500 hover:bg-white hover:border hover: border-red-500 hover:text-red-600 text-white  px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>}
        { onSubmit &&<button
          className="mt-4 bg-slate-500 hover:bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onSubmit}
        >
          Submit
        </button>}
        </div>
       
      </div>
    </div>
  );
};
export  default ModalUtil;