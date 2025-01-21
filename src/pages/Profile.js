import React, { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import ModalUtil from '../utils.js/Modal';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [user, setUser] = useState();
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    address: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    let parsedUser;
    if (userData) {
        parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users`);
        const data = await response.json();

        const person = data.find((u) => u.email === parsedUser?.email);
        if (person) {
          setUserData(person);
          setFormData({
            name: person.name || '',
            email: person.email || '',
            phone: person.phone || '',
            age: person.age || '',
            address: person.address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const fetchBookings = async () => {
    const response = await fetch(`http://localhost:5000/bookings`);
    const bookings = await response.json();
    console.log(bookings,"bookingswdawdawdawda")
    const userbooking = bookings.filter((b)=> b.useremail === userData?.email);
    console.log(userbooking,"bookings");
    setBookings(userbooking);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, ...formData }),
      });
      if (response.ok) {
        setUserData({ ...userData, ...formData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };
const handleModalClose = ()=>{
  setIsModalOpen(false);
}
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Profile Details</h2>
          <div className="space-y-3">
            {['name', 'email', 'phone', 'age', 'address']?.map((field) => (
              <div key={field} className="flex flex-col md:flex-row md:items-center md:justify-between">
                <label className="block font-medium capitalize md:w-1/4">{field}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded md:w-3/4"
                  />
                ) : (
                  <p className="md:w-3/4">{formData[field] || '—'}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4">
            <button
              onClick={() => {
                setIsModalOpen(true);
                fetchBookings();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
            >
              See My Bookings
            </button>
            <button
              onClick={isEditing ? handleSave : handleEditToggle}
              className="mt-2 sm:mt-0 px-4 py-2 bg-green-500 text-white rounded w-full sm:w-auto"
            >
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>

          <ModalUtil
            isOpen={isModalOpen}
            onClose={handleModalClose}

            contentLabel="Booking Details"
            className="bg-white p-6 max-w-lg mx-auto shadow-md rounded-md w-11/12 sm:w-full"
          >
            <h2 className="text-xl font-bold mb-4 text-center">My Bookings</h2>
            {bookings.length > 0 ? (
              <ul className="space-y-2">
                {bookings?.map((booking) => (
                  <li key={booking.id} className="border p-2 rounded">
                    <p><strong>Bus:</strong> {booking.id}</p>
                    <p><strong>Seat:</strong> {booking.seatno?.map((b)=>(<>{b}</>))}</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No bookings found.</p>
            )}
            {/* <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full"
            >
              Close
            </button> */}
          </ModalUtil>
        </div>
      </div>
    </>
  );
};

export default Profile;
