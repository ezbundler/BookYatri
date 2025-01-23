import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo_new.png';

import { motion } from 'framer-motion';
import defaultProfileImage from '../images/profile.jpg';
import ProfileAvatar from './ProfileAvatar';

const Navbar = ({profilepic}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUserLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    
    const fetchUser = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserLoggedIn(true);
        console.log(parsedUser,"parsed user in the navabar")
      }
    };

    fetchUser();
  },[profilepic]);

  return (
    <nav className="bg-red-600  border-b-4 border-yellow-400 p-4 flex justify-between items-center shadow-md relative z-10">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="BookYatri Logo" className="h-10" />
      </Link>

      <div className='flex gap-6'>
        <div className="hidden lg:flex items-center space-x-6">
          <Link to ='/home'><button className="text-white">Home</button></Link>
          {!userLoggedIn && <>
          
          <Link to="/login"><button className="block text-white py-2">Login</button></Link>
         <Link to="/signup"><button className="block text-white py-2">Sign Up</button></Link>
        </>
        }
          {/* <ThemeToggler /> */}
        </div>

        {userLoggedIn && (
          <div className="relative">
            <div onClick={handleProfileClick}>
        <ProfileAvatar keyword={ user?.profile || 'default'} width="50px" height='50px' />

            </div>
           
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-slate-500 border border-blue-400 shadow-md rounded-md py-2 z-20"
              >
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-gray-100 hover:text-gray-500 hover:bg-gray-300 "
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-gray-100 hover:text-gray-500  hover:bg-gray-300 "
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        )}

        <div className="lg:hidden flex items-center">
          <button onClick={handleMenuToggle} className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <motion.div
          className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 bg-slate-500 w-full border-t-2 p-4 gap-4`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/home"><button className="text-white mb-4">Home</button></Link>

          {!userLoggedIn && <>
          
            <Link to="/login"><button className="block text-white py-2">Login</button></Link>
           <Link to="/signup"><button className="block text-white py-2">Sign Up</button></Link>
          </>
          }
          {/* <ThemeToggler /> */}
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
