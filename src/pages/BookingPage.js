import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from 'react-modal';
import ModalUtil from '../utils.js/Modal';
const SeatBooking = () => {
  const { id } = useParams(); // Fetch bus ID from URL
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
const [seattype, setSeattype]= useState();
const[seatname, setSeatname]=useState();
  // Fetch the bus data by ID
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/buses/${id}`);
        if (!response.ok) throw new Error('Failed to fetch bus data');
        const data = await response.json();
        setBus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [id]);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // Handle seat booking
  const handleSeatClick = async (seatType, seatName) => {
   
    openModal();
    setSeattype(seatType)
    setSeatname(seatName);

   
  };
  function getRandomFourDigitString() {
    return (Math.floor(1000 + Math.random() * 9000)).toString();
  }
  
  const handleBooking = async () => {
    // if (!bus) return;
const userData = JSON.parse(localStorage.getItem("userData"));
    // Find and update the selected seat
    const updatedSeats = bus[seattype].map((seat) =>
      seat.name === seatname ? { ...seat, booked: true } : seat
    );

    // Update the bus data
    const updatedBus = { ...bus, [seattype]: updatedSeats };
const busBooking = {
  "id":getRandomFourDigitString(),
  "useremail":userData?.email,
  "setno":[seatname],
  "busId":id,
  "date": Date.now(),
}
    try {
      const response = await fetch(`http://localhost:5000/buses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBus),
      });

      if (!response.ok) throw new Error('Failed to update booking');

      setBus(updatedBus);
    setIsModalOpen(false);
      alert(`Seat ${seatname} booked successfully!`);
      const seatBook = await fetch(`http://localhost:5000/bookings`,{
        method: 'POST',
        headers:{
          'content-Type': 'application/json',
        },
        body: JSON.stringify(busBooking)
      })
      if(!seatBook.ok){
        throw new Error('Failed to add the booking in the booking list')
      }
    } catch (err) {
      alert('Error booking the seat. Please try again.');
    }
  };

  if (loading) return <p>Loading bus data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!bus) return <p>No bus found.</p>;

  return (
    <>
    <Navbar/>
    <div className="p-6">
  <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Bus: {bus.route}</h2>

  {/* Decks Wrapper */}
  <div className="flex flex-col lg:flex-row gap-8 justify-center">
    
    {/* Upper Deck */}
    <div className="w-full lg:w-1/4 min-h-[70vh] p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4 text-center">Upper Deck</h3>
      <div  className='grid grid-flow-col  h-[90%]'>

      <div className="grid grid-cols-1">
        {bus.UpperSeats?.filter((seat)=>seat.side ==='left').map((seat) => (
          <button
            key={seat.name}
            className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0  ${
              seat.booked ? 'bg-orange-500 dark:bg-purple-500 text-white  cursor-not-allowed' : 'bg-orange-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-400 hover:text-white dark:bg-purple-200 dark:border-purple-500 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white'
            } text-white font-semibold transition`}
            disabled={seat.booked}
            onClick={() => handleSeatClick('UpperSeats', seat.name)}
          >
            {seat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3">
        {bus.UpperSeats?.filter((seat)=>seat.side ==='right').map((seat) => (
          <button
            key={seat.name}
            className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
              seat.booked ?'bg-orange-500 dark:bg-purple-500 text-white  cursor-not-allowed' : 'bg-orange-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-400 hover:text-white dark:bg-purple-200 dark:border-purple-500 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white'
            } text-white font-semibold transition`}
            disabled={seat.booked}
            onClick={() => handleSeatClick('UpperSeats', seat.name)}
          >
            {seat.name}
          </button>
        ))}
      </div>
      </div>
    </div>

    {/* Lower Deck */}
    <div className="w-full lg:w-1/4 min-h-[70vh] p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4 text-center">Lower Deck</h3>
      <div className='grid grid-flow-col  h-[90%]'>
      <div className="grid grid-cols-1">
        {/* {bus.LowerSeats?.map((seat) => (
          <button
            key={seat.name}
            className={`p-2 rounded w-full ${
              seat.booked ? 'bg-red-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'
            } text-white font-semibold transition`}
            disabled={seat.booked}
            onClick={() => handleSeatClick('LowerSeats', seat.name)}
          >
            {seat.name}
          </button>
        ))} */}
         {bus.LowerSeats?.filter((bus)=>bus.side === 'left').map((seat) => (
          <button
            key={seat.name}
            className={`h-14 rounded w-16 mb-[0.5rem] lg:mb-0 ${
              seat.booked ? 'bg-orange-500 dark:bg-purple-500 text-white  cursor-not-allowed' : 'bg-orange-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-400 hover:text-white dark:bg-purple-200 dark:border-purple-500 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white'
            }  font-semibold transition`}
            disabled={seat.booked}
            onClick={() => handleSeatClick('LowerSeats', seat.name)}
          >
            {seat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3  ">
        {/* {bus.LowerSeats?.map((seat) => (
          <button
            key={seat.name}
            className={`p-2 rounded w-full ${
              seat.booked ? 'bg-red-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'
            } text-white font-semibold transition`}
            disabled={seat.booked}
            onClick={() => handleSeatClick('LowerSeats', seat.name)}
          >
            {seat.name}
          </button>
        ))} */}
         {bus.LowerSeats?.filter((bus)=>bus.side === 'right').map((seat) => (
          <button
            key={seat.name}
            className={` rounded w-16 h-14 mb-[0.5rem] lg:mb-0 ${
              seat.booked ? 'bg-orange-500 dark:bg-purple-500 text-white  cursor-not-allowed' : 'bg-orange-100 border-2 border-orange-500 text-orange-500 hover:bg-orange-400 hover:text-white dark:bg-purple-200 dark:border-purple-500 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white'
            }  font-semibold transition`}
            disabled={seat.booked}
            onClick={() => handleSeatClick('LowerSeats', seat.name)}
          >
            {seat.name}
          </button>
        ))}
      </div>
      </div>
      
    </div>
    <ModalUtil isOpen={isModalOpen} onClose={closeModal} onSubmit={handleBooking}>
        <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
        <div className="flex flex-col items-center">
  <img
    src="https://via.placeholder.com/150" // Replace with actual bus image URL
    alt="Bus"
    className="w-48 h-32 object-cover mb-4"
  />
  <h3 className="text-lg font-semibold mb-2">Super Deluxe Bus</h3> {/* Replace with actual bus name */}
  <p className="mb-2">Seat: 15A</p> {/* Replace with actual seat */}
  <p className="text-xl font-bold text-green-500">Cost: ₹750</p> {/* Replace with actual cost */}
</div>

      </ModalUtil>
  </div>
</div>

    </>
  );
};

export default SeatBooking;
