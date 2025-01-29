import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import ModalUtil from "../utils.js/Modal";
import busImg from "../images/bus1.png";
import DatePickerComponent from "../components/DatePicker";
import { toast } from "react-toastify";
import UserForm from "../components/BookingForm";
import BookingForm from "../components/BookingForm";
import { fetchAllBooking, fetchbusById, seatBooking } from "../services/buses";
import Button from "../utils.js/button";

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
    try {
      const bookings = await fetchAllBooking();
      setbookings(bookings.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const handleBookingSubmit = (formData) => {
    console.log("Form Data Received:", formData);
    setFormData(formData);
    closeFormModal();
    openBookingModal();
    setTotalCost(seatname.length * 750);
  };
  const userdata = JSON.parse(localStorage.getItem("userData"));
  const fetchBus = useCallback(async () => {
    const data = await fetchbusById({ id });

    if (data) {
      setBus(data.data);
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  }, [id]);

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
    if (!seatname.includes(seatName)) {
      setSeatname([...seatname, seatName]);
    } else {
      toast.error("Seat is already selected!");
    }
  };
  function getRandomFourDigitString() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  const handlePayment = () => {
    window.location.href = "https://book.stripe.com/test_3cs00A8gLbSp1yw3cc";
  };

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
      const seatBook = await seatBooking({ busBooking });
      if (seatBook.status === 201) {
        fetchBookingByDate();
        fetchBus();
        setSeatname([]);
        handlePayment();
        toast.info("successfully done booking");
      } else {
        throw new Error("Unable to Confirm the seat. Book again in sometime");
      }
    } catch (err) {
      toast.error("Error booking the seat. Please try again.");
      toast.error(`${err}`);
    }
  };

  const handleDateSelection = (date) => {
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
                <Button
                  onClick={openFormModal}
                  title="Book Ticket"
                  className="bg-red-600 border-2 border-red-600 hover:bg-[#fdeceb] hover:text-red-600 p-3 font-bold rounded-lg text-white relative flex items-center"
                >
                  <span className="ml-2 bg-yellow-400 text-red-100 hover:bg-[#fdfdf0] border-2 border-yellow-400 hover:text-yellow-500 font-bold text-sm rounded-full w-6 h-6 flex items-center justify-center absolute -top-2 -right-2">
                    {seatname.length}
                  </span>
                </Button>
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
                        <Button
                          onClick={() => handleSeatClick(seat?.name)}
                          keyProp={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            )
                              ? "bg-red-600 text-white cursor-not-allowed"
                              : seatname.includes(seat.name)
                              ? "bg-yellow-400 text-white cursor-not-allowed"
                              : "bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
                          disabled={filteredBookings?.some((b) =>
                            b.seatno.includes(seat?.name)
                          )}
                          title={seat?.name}
                        ></Button>
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
                        <Button
                          onClick={() => handleSeatClick(seat?.name)}
                          keyProp={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            )
                              ? "bg-red-600 text-white cursor-not-allowed"
                              : seatname.includes(seat.name)
                              ? "bg-yellow-400 text-white cursor-not-allowed"
                              : "bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
                          disabled={filteredBookings?.some((b) =>
                            b.seatno.includes(seat?.name)
                          )}
                          title={seat?.name}
                        ></Button>
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
                        <Button
                          onClick={() => handleSeatClick(seat?.name)}
                          keyProp={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            )
                              ? "bg-red-600 text-white cursor-not-allowed"
                              : seatname.includes(seat.name)
                              ? "bg-yellow-400 text-white cursor-not-allowed"
                              : "bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
                          disabled={filteredBookings?.some((b) =>
                            b.seatno.includes(seat?.name)
                          )}
                          title={seat?.name}
                        ></Button>
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
                        <Button
                          onClick={() => handleSeatClick(seat?.name)}
                          keyProp={seat.name}
                          className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
                            filteredBookings?.some((b) =>
                              b.seatno?.includes(seat.name)
                            )
                              ? "bg-red-600 text-white cursor-not-allowed"
                              : seatname.includes(seat.name)
                              ? "bg-yellow-400 text-white cursor-not-allowed"
                              : "bg-white border-2  text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          }  font-semibold transition`}
                          disabled={filteredBookings?.some((b) =>
                            b.seatno.includes(seat?.name)
                          )}
                          title={seat?.name}
                        ></Button>
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
              // onSubmit={()=>navigate('/payments')}
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
                <p className="text-xl font-bold text-green-500">
                  Total Fair: {totalCost}
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="text-xl font-bold mb-4 text-center">
                  Passenger Details
                </h3>
                {Object.entries(formData).map(([key, passenger], index) => (
                  <div key={index} className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-bold mb-2 text-center">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Details
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>Name:</strong> {passenger.name}
                      </li>
                      <li>
                        <strong>Age:</strong> {passenger.age}
                      </li>
                      <li>
                        <strong>Gender:</strong> {passenger.gender}
                      </li>
                      <li>
                        <strong>Aadhaar:</strong> {passenger.adhaarCardNo}
                      </li>
                      <li>
                        <strong>Phone:</strong> {passenger.phoneNumber}
                      </li>
                      <li>
                        <strong>Email:</strong> {passenger.email}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </ModalUtil>

            <ModalUtil isOpen={isFormModalOpen} onClose={closeFormModal}>
              {/* <UserForm onSubmit={handleFormSubmit}  /> */}
              <BookingForm
                count={seatname.length}
                onSubmit={handleBookingSubmit}
              />
            </ModalUtil>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatBooking;
