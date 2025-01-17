import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SeatBooking = () => {
  const { id } = useParams(); // Fetch bus ID from URL
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Handle seat booking
  const handleSeatClick = async (seatType, seatName) => {
    // if (!bus) return;

    // Find and update the selected seat
    const updatedSeats = bus[seatType].map((seat) =>
      seat.name === seatName ? { ...seat, booked: true } : seat
    );

    // Update the bus data
    const updatedBus = { ...bus, [seatType]: updatedSeats };

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
      alert(`Seat ${seatName} booked successfully!`);
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

  </div>
</div>

    </>
  );
};

export default SeatBooking;
