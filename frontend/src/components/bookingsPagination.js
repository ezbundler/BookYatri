import React, { useEffect, useState } from "react";

const BookingsPagination = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 4;

useEffect((effect)=>{
    const loadBookings = ()=>{
     setLoading(true);
     setError("");
     try {
        
     } catch (error) {
        setError("Failed to load Bookings. Please try again.");
     }finally{
        setLoading(false);
     }   
    }
},[page])




  return <div>bookingsPagination</div>;
};

export default BookingsPagination;
