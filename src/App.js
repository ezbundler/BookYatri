import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import for React Router v6
import HomePage from './pages/HomePage';

// import HeroPage from './pages/HeroPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';
// import ProtectedRoute from '../utils.js/ProtectedRoute';
import Protectedroute from './utils.js/ProtectedRoute';
import SeatBooking from './pages/BookingPage';

function App() {
  return (
    <div className='min-h-screen bg-custom-gradient dark:bg-customdark-gradient'>

    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={
          <Protectedroute>

            <HomePage  />
          </Protectedroute>
        }/>
        <Route path="/seatBooking/:id" element={
          <Protectedroute>

            <SeatBooking  />
          </Protectedroute>
        }/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
