import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import busImage from "../images/bus1.png";
import { toast } from "react-toastify";
import axios from "axios";

const BusServiceForm = ({ onClose, fetchbuses }) => {
  const [busName, setBusName] = useState("");
  const [busRoute, setBusRoute] = useState("");
  const [busList, setBusList] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
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

    // Validate form inputs
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newBusData = {
        id: (Math.floor(1000 + Math.random() * 9000)).toString(),
        name: busName,
        route: busRoute,
        UpperSeats: generateSeats("U"),
        LowerSeats: generateSeats("L"),
      };
      

    handleCreateNewBus(newBusData);
    setBusName("");
    setBusRoute("");
    onClose();
    fetchbuses();
  };

  // Form validation with real-time feedback on blur (when field loses focus)
  const validateForm = () => {
    const validationErrors = {};
  
    // Bus name can contain letters, numbers, space, hyphen, and slash
    if (!busName.trim()) {
      validationErrors.busName = "Bus name is required.";
    } else if (/[^a-zA-Z0-9\s/-]/g.test(busName)) {
      validationErrors.busName = "Bus name should only contain letters, numbers, spaces, hyphens, or slashes.";
    }
  
    // Bus route can contain letters, numbers, space, hyphen, and slash
    if (!busRoute.trim()) {
      validationErrors.busRoute = "Bus route is required.";
    } else if (/[^a-zA-Z0-9\s/-]/g.test(busRoute)) {
      validationErrors.busRoute = "Bus route should only contain letters, numbers, spaces, hyphens, or slashes.";
    }
  
    return validationErrors;
  };
  

  const generateSeats = (prefix) => {
    const seats = [];
    for (let i = 1; i <= 24; i++) {
      seats.push({
        name: `${prefix}${i}`,
        side: i <= 6 ? "left" : "right",
        booked: Math.random() > 0.7,
      });
    }
    return seats;
  };

  const handleCreateNewBus = async (busData) => {
    try {
        console.log(busData, "data before creating bus");
        const response = await axios.post("http://localhost:5000/buses", busData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201 || response.status === 200) {
            toast.success(`${busData.name} created successfully!`);
        } else {
            toast.error("Failed to create a new bus.");
        }
    } catch (error) {
        toast.error("Error while creating a new bus: " + error.message);
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "busName") {
      setBusName(value);
      setErrors((prev) => ({ ...prev, busName: "" }));
    } else if (name === "busRoute") {
      setBusRoute(value);
      setErrors((prev) => ({ ...prev, busRoute: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validateForm();
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  return (
    <div className="flex flex-col mt-4 bg-white p-6 rounded-lg w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-400">
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
                name="busName"
                value={busName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter bus name"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.busName ? "border-red-500" : "focus:ring-yellow-400"
                }`}
                required
              />
              {errors.busName && (
                <p className="text-red-500 text-sm mt-1">{errors.busName}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700">
                Bus Route:
              </label>
              <input
                type="text"
                name="busRoute"
                value={busRoute}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter bus route"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.busRoute ? "border-red-500" : "focus:ring-yellow-400"
                }`}
                required
              />
              {errors.busRoute && (
                <p className="text-red-500 text-sm mt-1">{errors.busRoute}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-white font-semibold hover:text-yellow-400 py-2 px-4 rounded-md hover:bg-white  border-2 border-yellow-400 transition"
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
