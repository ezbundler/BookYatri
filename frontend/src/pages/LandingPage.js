import React from 'react';
// import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import heroMP4 from '../images/heroMP4.mp4';  
import RotatingTaglines from '../components/Taglines';
// import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      
      <div className="parent-container flex flex-col-reverse lg:flex-row lg:h-[89vh]">
      <div className="first-half  lg:w-1/2 w-full p-2 flex flex-col justify-center items-center space-y-2">
  {/* Content for first-half */}
  <RotatingTaglines />
 
</div>

<div className="second-half lg:w-1/2 w-full p-4 flex justify-center items-center">
  <video
    src={heroMP4} // Use your MP4 file here
    className="text-white text-2xl h-[50vh] lg:h-[100%]"
    autoPlay
    loop
    muted
    // animate={{
    //   y: [0, 10, -10, 0], 
    // }}
    // transition={{
    //   repeat: Infinity, 
    //   duration: 3, 
    //   ease: 'easeInOut', 
    // }}
  >
    Your browser does not support the video tag.
  </video>
</div>

</div>


      
    </>
  );
};

export default LandingPage;
