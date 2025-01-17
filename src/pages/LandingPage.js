import React from 'react';
// import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import heroIMG from '../images/logo1.png';  
import RotatingTaglines from '../components/Taglines';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      
      <div className="parent-container flex flex-col-reverse lg:flex-row lg:h-[89vh]">
      <div className="first-half  lg:w-1/2 w-full p-2 flex flex-col justify-center items-center space-y-2">
  {/* Content for first-half */}
  <RotatingTaglines />
 
</div>

  <div className="second-half  lg:w-1/2 w-full p-4 flex justify-center items-center">
  
    <motion.img
        src={heroIMG}
        alt="BookYatri Logo"
        className="text-white text-2xl h-[50vh] lg:h-[100%]"
        animate={{
          y: [0, 10, -10, 0], 
        }}
        transition={{
          repeat: Infinity, 
          duration: 3, 
          ease: 'easeInOut', 
        }}
      />
  </div>
</div>


      
    </>
  );
};

export default LandingPage;
