import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const taglines = [
  "Want to travel with friends? 🚍✨",
  "Your next adventure awaits! 🌍🎒",
  "Travel in comfort and style! 🚌💺",
  "Affordable travel, endless memories! 🎟️💸",
  "Planning a trip with friends or family? 🧳👫👭",
  "Easy. Fast. Reliable. 🕒🚌"
 
];

const colors = [
  'text-yellow-400',  // Bright and vibrant orange
  'text-purple-500',  // Soft purple with good contrast
  'text-blue-400',     // Bold red, visible on all backgrounds
  'text-green-500'    // Dark green for strong contrast
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
      <div className="text-xl md:text-3xl lg:text-3xl xl:text-4xl text-bold text-red-600 font-bold ">
        Welcome to Boook Yatrii
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
      <Link to='/signup'>
      
      <button className='p-4 bg-yellow-400 text-white font-medium rounded-lg hover:bg-red-600'>Book Ticket Now</button>
      </Link>
    </div>
  );
};

export default RotatingTaglines;
