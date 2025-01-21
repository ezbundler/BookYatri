import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import ModalUtil from "../utils.js/Modal";
import busImg from "../images/bus1.png";
import DatePickerComponent from "../components/DatePicker";
import { toast } from "react-toastify";
const SeatBooking = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [seatname, setSeatname] = useState([]);
  const [BookingDate, setBookingDate] = useState("");
  const [bookings, setbookings] = useState();

  const fetchBookingByDate = async () => {
    const response = await fetch(`http://localhost:5000/bookings`);
    const data = await response.json();
    console.log(data, "bookingswdawdawdawda");
    setbookings(data);
  };

  const fetchBus = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/buses/${id}`);
      if (!response.ok) throw new Error("Failed to fetch bus data");
      const data = await response.json();
      setBus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    fetchBookingByDate();
  }, [BookingDate]);
  useEffect(() => {
    fetchBus();
  }, [id, fetchBus]);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSeatClick = async (seatName) => {
    console.log(seatName, "seatName");
    setSeatname([...seatname, seatName]);
  };
  function getRandomFourDigitString() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  const handleBooking = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    const busBooking = {
      id: getRandomFourDigitString(),
      useremail: userData?.email,
      seatno: seatname,
      busId: id,
      date: BookingDate,
    };
    try {
      setIsModalOpen(false);

      const seatBook = await fetch(`http://localhost:5000/bookings`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(busBooking),
      });
      if (!seatBook.ok) {
        throw new Error("Failed to add the booking in the booking list");
      }
      fetchBookingByDate();
      fetchBus();
      setSeatname([]);
      toast.info("successfully done booking");
    } catch (err) {
      alert("Error booking the seat. Please try again.");
    }
  };

  const handleDateSelection = (date) => {
    console.log("Selected Date now:", date);
    setBookingDate(date);
    setSeatname([]);
  };

  if (loading) return <p>Loading bus data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!bus) return <p>No bus found.</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <DatePickerComponent onDateSelect={handleDateSelection} />
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-700 ">
          Bus: {bus.route}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          <div className="w-full lg:w-1/4 min-h-[70vh] p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-center text-slate-500">
              Upper Deck
            </h3>
            <div className="grid grid-flow-col  h-[90%]">
              <div className="grid grid-cols-1">
                {bus.UpperSeats?.filter((seat) => seat.side === "left").map(
                  (seat) => {
                    const filteredBookings = bookings.filter(
                      (b) => b.date === BookingDate
                    );

                    return (
                      <button
                        key={seat.name}
                        className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                          filteredBookings.some((b) =>
                            b.seatno.includes(seat.name)
                          ) || seatname.includes(seat.name)
                            ? "bg-slate-400 text-slate-700 cursor-not-allowed"
                            : "bg-slate-300 border-2 border-slate-400 text-slate-500 hover:bg-slate-400 hover:text-white"
                        } text-white font-semibold transition`}
                        disabled={filteredBookings.some((b) =>
                          b.seatno.includes(seat.name)
                        )}
                        onClick={() => handleSeatClick(seat.name)}
                      >
                        {seat.name}
                      </button>
                    );
                  }
                )}
              </div>
              <div className="grid grid-cols-3">
                {bus.UpperSeats?.filter((seat) => seat.side === "right").map(
                  (seat) => {
                    const filteredBookings = bookings.filter(
                      (b) => b.date === BookingDate
                    );

                    return (
                      <button
                        key={seat.name}
                        className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                          filteredBookings.some((b) =>
                            b.seatno.includes(seat.name)
                          )
                            ? "bg-slate-400 text-slate-700 cursor-not-allowed"
                            : "bg-slate-300 border-2 border-slate-400 text-slate-500 hover:bg-slate-400 hover:text-white"
                        } text-white font-semibold transition`}
                        disabled={filteredBookings.some((b) =>
                          b.seatno.includes(seat.name)
                        )}
                        onClick={() => handleSeatClick(seat.name)}
                      >
                        {seat.name}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/4 min-h-[70vh] p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-center text-slate-500">
              Lower Deck
            </h3>
            <div className="grid grid-flow-col  h-[90%]">
              <div className="grid grid-cols-1">
                {bus.LowerSeats?.filter((seat) => seat.side === "left").map(
                  (seat) => {
                    const filteredBookings = bookings.filter(
                      (b) => b.date === BookingDate
                    );

                    return (
                      <button
                        key={seat.name}
                        className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                          filteredBookings.some((b) =>
                            b.seatno.includes(seat.name)
                          )
                            ? "bg-slate-400 text-slate-700 cursor-not-allowed"
                            : "bg-slate-300 border-2 border-slate-400 text-slate-500 hover:bg-slate-400 hover:text-white"
                        } text-white font-semibold transition`}
                        disabled={filteredBookings.some((b) =>
                          b.seatno.includes(seat.name)
                        )}
                        onClick={() => handleSeatClick(seat.name)}
                      >
                        {seat.name}
                      </button>
                    );
                  }
                )}
              </div>
              <div className="grid grid-cols-3  ">
                {bus.LowerSeats?.filter((seat) => seat.side === "right").map(
                  (seat) => {
                    const filteredBookings = bookings.filter(
                      (b) => b.date === BookingDate
                    );

                    return (
                      <button
                        key={seat.name}
                        className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                          filteredBookings.some((b) =>
                            b.seatno.includes(seat.name)
                          )
                            ? "bg-slate-400 text-slate-700 cursor-not-allowed"
                            : "bg-slate-300 border-2 border-slate-400 text-slate-500 hover:bg-slate-400 hover:text-white"
                        } text-white font-semibold transition`}
                        disabled={filteredBookings.some((b) =>
                          b.seatno.includes(seat.name)
                        )}
                        onClick={() => handleSeatClick(seat.name)}
                      >
                        {seat.name}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <ModalUtil
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleBooking}
          >
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4 items-center">
                Confirm Booking
              </h2>
            </div>
            <div className="flex flex-col items-center border rounded-lg">
              <img
                src={busImg}
                alt="Bus"
                className="w-48 h-32 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{bus.name}</h3>
              <p className="mb-2">Seat: {seatname.join(",")}</p>
              <p className="text-xl font-bold text-green-500">Cost: ₹750</p>
            </div>
          </ModalUtil>
        </div>
        {seatname.length > 0 && (
          <button onClick={() => openModal()}>BOOK TICKET</button>
        )}
      </div>
    </>
  );
};

export default SeatBooking;
