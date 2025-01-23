import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import ModalUtil from "../utils.js/Modal";
import busImg from "../images/bus1.png";
import DatePickerComponent from "../components/DatePicker";
import { toast } from "react-toastify";
import UserForm from "../components/BookingForm";
const SeatBooking = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [seatname, setSeatname] = useState([]);
  const [BookingDate, setBookingDate] = useState("");
  const [bookings, setbookings] = useState();
const [totalCost, setTotalCost] = useState();
  const fetchBookingByDate = async () => {
    const response = await fetch(`http://localhost:5000/bookings`);
    const data = await response.json();
    console.log(data, "bookingswdawdawdawda");
    setbookings(data);
  };
  const handleFormSubmit = (formData) => {
    console.log("Form Data Received:", formData);
    setFormData(formData);
    closeFormModal();
    openBookingModal();
    setTotalCost(seatname.length*750);

    // You can process form data here (send to API, state management, etc.)
  };
  const userdata =JSON.parse(localStorage.getItem('userData')) 
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
    console.log(seatname, "seatname");
  });
  useEffect(() => {
    fetchBookingByDate();
  }, [BookingDate]);
  useEffect(() => {
    fetchBus();
  }, [id, fetchBus]);
  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };
  const openFormModal = () => {
    setIsFormModalOpen(true);
  };
  const closeFormModal = () => {
    setIsFormModalOpen(false);

  };
  const handleSeatClick = async (seatName) => {
    if (!BookingDate) {
      toast.warning("Please select a date first");
      return;
    }
    console.log(seatName, "seatName");

    // Check if the seatName already exists in the seatname array
    if (!seatname.includes(seatName)) {
      setSeatname([...seatname, seatName]);
    } else {
      toast.error("Seat is already selected!");
    }
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
      userDetails: formData,
    };
    try {
      setIsBookingModalOpen(false);

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
      <div className="p-4 lg:p-2">
        <div className=" ">
          <div className=" flex flex-col lg:flex-row justify-center gap-6 align-middle items-center">
            <div className="lg:w-2/3  w-full flex flex-col  lg:items-end items-center lg:pr-28 ">
              <DatePickerComponent onDateSelect={handleDateSelection} />
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-700 ">
                Bus: {bus.route}
              </h2>
            </div>
            <div className="lg:w-1/3 w-full flex justify-center relative">
              {seatname.length > 0 && (
                <button
                  onClick={() => openFormModal()}
                  className="bg-red-600 border-2 border-red-600 hover:bg-[#fdeceb] hover:text-red-600 p-3 font-bold rounded-lg text-white relative flex items-center"
                >
                  Book Ticket
                  <span className="ml-2 bg-yellow-400 text-red-100 hover:bg-[#fdfdf0] border-2 border-yellow-400 hover:text-yellow-500 font-bold text-sm rounded-full w-6 h-6 flex items-center justify-center absolute -top-2 -right-2">
                    {seatname.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            <div className="w-full lg:w-1/4 min-h-[70vh] p-4 rounded-lg shadow-md bg-[#fdfdf0]">
              <h3 className="text-xl font-semibold mb-4 text-center text-slate-500">
                Upper Deck
              </h3>
              <div className="grid grid-flow-col  h-[90%]">
                <div className="grid grid-cols-1">
                  {bus.UpperSeats?.filter((seat) => seat.side === "left")?.map(
                    (seat) => {
                      const filteredBookings = bookings?.filter(
                        (b) => b.date === BookingDate
                      );

                      return (
                        <button
                          key={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            ) 
                              ? "bg-red-600 text-white cursor-not-allowed"
                              :  seatname.includes(seat.name)? "bg-yellow-400 text-white cursor-not-allowed":"bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
                          disabled={filteredBookings?.some((b) =>
                            b.seatno.includes(seat?.name)
                          )}
                          onClick={() => handleSeatClick(seat?.name)}
                        >
                          {seat?.name}
                        </button>
                      );
                    }
                  )}
                </div>
                <div className="grid grid-cols-3">
                  {bus.UpperSeats?.filter((seat) => seat.side === "right")?.map(
                    (seat) => {
                      const filteredBookings = bookings?.filter(
                        (b) => b.date === BookingDate
                      );

                      return (
                        <button
                          key={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0  ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            ) 
                              ? "bg-red-600 text-white cursor-not-allowed"
                              :  seatname.includes(seat.name)? "bg-yellow-400 text-white cursor-not-allowed":"bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
                          disabled={filteredBookings?.some((b) =>
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

            <div className="w-full lg:w-1/4 min-h-[70vh] p-4 rounded-lg shadow-md bg-[#fdfdf0]">
              <h3 className="text-xl font-semibold mb-4 text-center text-slate-500">
                Lower Deck
              </h3>
              <div className="grid grid-flow-col  h-[90%]">
                <div className="grid grid-cols-1">
                  {bus.LowerSeats?.filter((seat) => seat.side === "left")?.map(
                    (seat) => {
                      const filteredBookings = bookings?.filter(
                        (b) => b.date === BookingDate
                      );

                      return (
                        <button
                          key={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0  ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            ) 
                              ? "bg-red-600 text-white cursor-not-allowed"
                              :  seatname.includes(seat.name)? "bg-yellow-400 text-white cursor-not-allowed":"bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
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
                      const filteredBookings = bookings?.filter(
                        (b) => b.date === BookingDate
                      );

                      return (
                        <button
                          key={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0  ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            ) 
                              ? "bg-red-600 text-white cursor-not-allowed"
                              :  seatname.includes(seat.name)? "bg-yellow-400 text-white cursor-not-allowed":"bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
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
              isOpen={isBookingModalOpen}
              onClose={closeBookingModal}
              onSubmit={handleBooking}
            >
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
              </div>

              <div className="flex flex-col items-center border rounded-lg p-4">
                <img
                  src={busImg}
                  alt="Bus"
                  className="w-48 h-32 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{bus.name}</h3>
                <p className="mb-2 font-medium">Seats: {seatname.join(", ")}</p>
                <p className="text-xl font-bold text-green-500">Total Fair: {totalCost}</p>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-bold mb-2 text-center">
                  Passenger Details
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Name:</strong> {formData.name}
                  </li>
                  <li>
                    <strong>Age:</strong> {formData.age}
                  </li>
                  <li>
                    <strong>Gender:</strong> {formData.gender}
                  </li>
                  <li>
                    <strong>Aadhaar:</strong> {formData.adhaarCardNo}
                  </li>
                  <li>
                    <strong>Phone:</strong> {formData.phoneNumber}
                  </li>
                  <li>
                    <strong>Email:</strong> {formData.email}
                  </li>
                </ul>
              </div>
            </ModalUtil>

            <ModalUtil isOpen={isFormModalOpen} onClose={closeFormModal}>
              <UserForm onSubmit={handleFormSubmit} />
            </ModalUtil>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatBooking;
