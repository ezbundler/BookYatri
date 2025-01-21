import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const taglines = [
  "Your Journey, Your Seat, Your Choice.",
  "Booking Seats Made Easy, Travel Made Comfortable.",
  "Travel with Comfort, Book with Ease.",
  "The Road Awaits—Book Your Seat in Seconds.",
  "Smart Seat Selection for Every Traveler.",
  "Sit Back, Relax, and Book Your Bus Seat Online.",
  "Your Travel, Your Comfort—Book Your Seat Now!",
  "Where Every Seat is Just a Click Away.",
  "Seamless Booking for Every Ride.",
  "Hassle-Free Bus Seat Booking, Anytime, Anywhere."
];

const colors = [
  'text-orange-400',  // Bright and vibrant orange
  'text-purple-400',  // Soft purple with good contrast
  'text-red-500',     // Bold red, visible on all backgrounds
  'text-green-700'    // Dark green for strong contrast
];

const RotatingTaglines = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Cycle through colors in order using currentIndex
  const currentColor = colors[currentIndex % colors.length];

  return (
    <div className="flex justify-center flex-col items-center h-40 sm:h-60 lg:h-80 p-0">
      <div className="text-xl md:text-3xl lg:text-3xl xl:text-4xl text-bold text-black ">
        Welcome to Book Yatri
      </div>
      <motion.div
        key={currentIndex}
        className={`text-center font-bold p-4 ${currentColor} text-xl md:text-3xl lg:text-3xl xl:text-4xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
      >
        {taglines[currentIndex]}
      </motion.div>
    </div>
  );
};

export default RotatingTaglines;
