import React, { useCallback, useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import DatePickerComponent from "../components/DatePicker";
import { fetchAllBooking, fetchbusById, seatBooking } from "../services/buses";
import Button from "../utils.js/button";

// Lazy loading components
const ModalUtil = lazy(() => import("../utils.js/Modal"));
const BookingForm = lazy(() => import("../components/BookingForm"));
const busImg = lazy(() => import("../images/bus1.png")); // Lazy loading the image import

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
    setFormData(formData);
    closeFormModal();
    openBookingModal();
    setTotalCost(seatname.length * 750);
  };

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

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);
  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => setIsFormModalOpen(false);

  const handleSeatClick = (seatName) => {
    if (!BookingDate) {
      toast.warning("Please select a date first");
      return;
    }
    if (!seatname.includes(seatName)) {
      setSeatname([...seatname, seatName]);
    } else {
      toast.error("Seat is already selected!");
    }
  };

  const handleBooking = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const busBooking = {
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
        toast.info("Successfully booked!");
      } else {
        throw new Error("Unable to confirm the seat. Try again later.");
      }
    } catch (err) {
      toast.error("Error booking the seat.");
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
        <Suspense fallback={<p>Loading...</p>}>
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

          <ModalUtil isOpen={isBookingModalOpen} onClose={closeBookingModal}>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
            </div>
            <div className="flex flex-col items-center border rounded-lg p-4">
              <img
                src={busImg}
                alt="Bus"
                className="w-48 h-32 object-cover mb-4"
                loading="lazy" // Lazy load image attribute
              />
              <h3 className="text-lg font-semibold mb-2">{bus.name}</h3>
              <p className="mb-2 font-medium">Seats: {seatname.join(", ")}</p>
              <p className="text-xl font-bold text-green-500">
                Total Fare: {totalCost}
              </p>
            </div>
          </ModalUtil>

          <ModalUtil isOpen={isFormModalOpen} onClose={closeFormModal}>
            <BookingForm count={seatname.length} onSubmit={handleBookingSubmit} />
          </ModalUtil>
        </Suspense>
      </div>
    </>
  );
};

export default SeatBooking;
