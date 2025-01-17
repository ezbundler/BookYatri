import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo3.png';  // Import the logo image
import ThemeToggler from '../utils.js/ThemeToggler';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchUser = () => {
      const user = localStorage.getItem('userData');
      if (user) {
        console.log(user, 'user data');
      } else {
        console.log('user not logged in');
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="bg-orange-500 dark:bg-black  border-b-4 border-purple-600 dark:border-orange-600 p-4 flex justify-between items-center shadow-md relative z-10">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="BookYatri Logo" className="h-10" />
      </Link>

      {/* Routes and ThemeToggler for large screens */}
      <div className="hidden lg:flex items-center space-x-6">
        <Link to="/home">
          <button className="text-white">Home</button>
        </Link>
        <Link to="/login">
          <button className="text-white">Login</button>
        </Link>
        <Link to="/signup">
          <button className="text-white">Sign Up</button>
        </Link>
        <ThemeToggler />
      </div>

      {/* Burger Menu for small screens */}
      <div className="lg:hidden flex items-center">
        <button onClick={handleMenuToggle} className="text-white focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Dropdown Menu for smaller screens */}
      <motion.div
        className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 bg-orange-500 w-full border-t-2 border-orange-700 p-4`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/login">
          <button className="block text-white py-2">Login</button>
        </Link>
        <Link to="/signup">
          <button className="block text-white py-2">Sign Up</button>
        </Link>
        <ThemeToggler />
      </motion.div>
    </nav>
  );
};

export default Navbar;
