import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import busImage from "../images/bus1.png";

const BusServiceForm = ({ onClose }) => {
  const [busName, setBusName] = useState("");
  const [busRoute, setBusRoute] = useState("");
  const [busList, setBusList] = useState([]);

  useEffect(() => {
    // Fetch existing buses from the backend
    const fetchBuses = async () => {
      try {
        const response = await fetch("http://localhost:5000/buses");
        if (response.ok) {
          const buses = await response.json();
          setBusList(buses);
        } else {
          console.error("Failed to fetch buses.");
        }
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };
    fetchBuses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBusData = {
      id: (busList.length + 1).toString(), // Set the new ID based on the bus list length
      name: busName,
      route: busRoute,
      UpperSeats: generateSeats("U"),
      LowerSeats: generateSeats("L"),
    };
    handleCreateNewBus(newBusData);
    setBusName("");
    setBusRoute("");
    onClose();
  };

  // Generate seats dynamically based on prefix
  const generateSeats = (prefix) => {
    const seats = [];
    for (let i = 1; i <= 24; i++) {
      seats.push({
        name: `${prefix}${i}`,
        side: i <= 6 ? "left" : "right",
        booked: Math.random() > 0.7, // Random booking status
      });
    }
    return seats;
  };

  // Create a new bus in the backend
  const handleCreateNewBus = async (busData) => {
    try {
      const response = await fetch("http://localhost:5000/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(busData),
      });
      if (response.ok) {
        console.log("Bus created successfully:", busData);
      } else {
        console.error("Failed to create a new bus.");
      }
    } catch (error) {
      console.error("Error while creating a new bus:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">
          Create New Bus Service
        </h2>
      </div>

      {/* Form Section */}
      <div className="flex flex-col md:flex-row-reverse gap-6">
        <motion.div
          className="w-full md:w-1/2 p-4 flex justify-center items-center md:h-40 mb-4 md:mb-0 h-40"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
        >
          <img
            src={busImage}
            alt="Bus Illustration"
            className="w-3/4 h-80 md:h-auto max-h-[400px] object-cover"
          />
        </motion.div>

        <div className="w-full md:w-1/2 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Bus Name:
              </label>
              <input
                type="text"
                value={busName}
                onChange={(e) => setBusName(e.target.value)}
                placeholder="Enter bus name"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Bus Route:
              </label>
              <input
                type="text"
                value={busRoute}
                onChange={(e) => setBusRoute(e.target.value)}
                placeholder="Enter bus route"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition"
            >
              Create Bus Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusServiceForm;
