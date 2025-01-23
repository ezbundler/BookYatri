import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroIMG from "../images/conductor.png";
import Navbar from "../components/Navbar";
import AdminHome from "../components/AdminHomePage";

const HomePage = () => {
  const [busList, setBusList] = useState();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const handleBooking = (id) => {
    navigate(`/seatBooking/${id}`);
  };

  useEffect(() => {
    const LoadBuses = async () => {
      const response = await fetch("http://localhost:5000/buses");
      const buses = await response.json();
      console.log(buses, "busses");
      setBusList(buses);
    };
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem("userData");
        let parsedUser;
        if (userData) {
          parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log(parsedUser, "user");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
    LoadBuses();
  }, []);
  return (
    <>
      <Navbar />
      {user?.role === "user" ? (
        <>
          <div className="lg:h-[89vh]  flex flex-col lg:flex-row items-center justify-between p-8">
            <div className="flex flex-col items-center justify-center rounded-lg lg:h-full lg:ml-10 space-y-6 w-full lg:w-[60%] py-4">
              <h1 className="text-4xl font-bold mb-4 text-center text-red-600">
                Welcome to Your Hero Page
              </h1>

              {busList?.map((bus, index) => (
                <div
                  key={index}
                  className="bg-slate-200 border border-red-600 p-6 rounded-lg shadow-lg w-full max-w-3xl flex justify-between items-center text-center"
                >
                  <h3 className="text-xl font-semibold text-red-600 ">
                    {bus?.route}
                  </h3>
                  <button
                    onClick={() => handleBooking(bus.id)}
                    className="mt-4 px-6 py-2 rounded bg-yellow-400 text-white 
           hover:bg-slate-200  
           hover:text-yellow-500
           hover:border-2 
           hover:border-yellow-400
          
           transition-all duration-500 ease-in-out"
                  >
                    Book Seat
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center lg:h-full w-full lg:w-[40%] mt-8 lg:mt-0">
              <motion.img
                src={heroIMG}
                alt="BookYatri Logo"
                className="text-white text-2xl sm:h-[50%] lg:h-[100%]"
                animate={{
                  y: [0, 13, -13, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <AdminHome />
      )}
    </>
  );
};

export default HomePage;
