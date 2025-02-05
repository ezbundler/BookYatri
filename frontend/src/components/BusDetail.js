import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import driver from "../images/driver2.png"
import LoaderModal from './Loader';

const BusDetail = ({ busId ,onClose}) => {
  const [bus, setBus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBus, setEditedBus] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const fetchBusDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/buses/${busId}`);
      setBus(response.data);
      setEditedBus(response.data);
    } catch (error) {
      toast.error("Failed to fetch bus details.");
    }
  };

  useEffect(() => {
    fetchBusDetail();
  }, [busId]);

  const handleEditChange = (e) => {
    setEditedBus({
      ...editedBus,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/buses/${busId}`, editedBus);
      setBus(editedBus);
      setIsEditing(false);
      toast.success("Bus details updated successfully.");
      onClose();
     
    } catch (error) {
      toast.error("Failed to update bus details.");
    }
  };

  const handleDelete = async () => {
    if (deleteInput !== "confirm delete") {
      toast.error("Please type 'confirm delete' correctly.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/buses/${busId}`);
      toast.success("Bus deleted successfully.");
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      toast.error("Failed to delete bus.");
    }
  };

  if (!bus) return <LoaderModal/>;

  return (
    <div className="p-4 md:p-8 bg-white rounded-xl mt-4 flex flex-col md:flex-row gap-4 md:gap-8 shadow-md">
    <ToastContainer />

    {/* Space for Image */}
    <div className="w-full md:w-1/3 flex justify-center items-center">
      <img
        src={driver}
        alt="Man standing with thumbs up"
        className="w-40 h-56 object-cover"
      />
    </div>

    <div className="w-full md:w-2/3">
      <motion.h2
        className="text-2xl font-bold text-gray-500 mb-4"
        initial={{ x: -5 }}
        animate={{ x: 5 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
      >
        Bus Details
      </motion.h2>
      {isEditing ? (
        <div>
          <label>
            Bus Name:
            <input
              type="text"
              name="name"
              value={editedBus.name || ""}
              onChange={handleEditChange}
              className="border border-gray-300 p-2 rounded w-full mt-1 mb-2 focus:ring-2 focus:ring-red-600"
            />
          </label>
          <label>
            Bus Route:
            <input
              type="text"
              name="route"
              value={editedBus.route || ""}
              onChange={handleEditChange}
              className="border border-gray-300 p-2 rounded w-full mt-1 mb-2 focus:ring-2 focus:ring-red-600"
            />
          </label>
          <button
            onClick={handleSave}
            className="bg-yellow-400 text-gray-800 p-2 rounded hover:bg-yellow-500 mr-2 shadow-md w-full md:w-auto"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 shadow-md w-full md:w-auto mt-2 md:mt-0"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> <span className='text-gray-500'>{bus.name}</span></p>
          <p><strong>Route:</strong><span className='text-gray-500'> {bus.route}</span></p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-400 text-gray-800 p-2 rounded hover:bg-yellow-500 mr-2 shadow-md w-full md:w-auto mt-2"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 shadow-md w-full md:w-auto mt-2 md:mt-0"
          >
            Delete
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-100 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Do you really wish to Delete this?</h3>
            <p className="mb-2">This step is irreversible. Please type "confirm delete" to Delete.</p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="border p-2 rounded w-full mb-4 focus:ring-2 focus:ring-red-600"
              placeholder="Type 'confirm delete' here..."
            />
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 shadow-md w-full md:w-auto"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 shadow-md w-full md:w-auto mt-2 md:mt-0"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default BusDetail;
