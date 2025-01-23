import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ModalUtil from '../utils.js/Modal';
import noBookingsImage from '../images/logo2.png';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ProfileSelector } from '../components/ProfileSelector';
import ProfileAvatar from '../components/ProfileAvatar';
const Profile = () => {
  const [userData, setUserData] = useState({});
  const [user, setUser] = useState();
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isAvatarSelectorOpen, setisAvatarSelectorOpen] = useState(false);
  const [navbarImg, setnavbarIMg] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    profile: "default"
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
            address: person.address || '',
            profile: person.profile || "default"
          });
          setSelectedAvatar(person.profile);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
    const fetchBookings = async () => {
      console.log("inside fetchbookings")
      const response = await fetch(`http://localhost:5000/bookings`);
      const bookings = await response.json();
      const userbooking = bookings.filter((b) => b.useremail === parsedUser?.email);
      setBookings(userbooking);
    };
    fetchBookings()
  }, []);

 

  

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
        body: JSON.stringify({ ...userData, ...formData , profile: selectedAvatar|| userData.person }),
      });
      if (response.ok) {
        setUserData({ ...userData, ...formData });
        setIsEditing(false);
        setnavbarIMg(!navbarImg);
      }
    
      localStorage.setItem("userData", JSON.stringify({ ...userData, ...formData , profile: selectedAvatar|| userData.person }));
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
const handleAvatarSelectorOpen = ()=>{
  setisAvatarSelectorOpen(true);
}
const handleAvatarSelectorClose = ()=>{
  setisAvatarSelectorOpen(false);
}

const handleAvatarSelection = (keyword) => {
  setSelectedAvatar(keyword);
  console.log('Selected Avatar:', keyword);
};
  return (
    <>
      <Navbar profilepic={navbarImg}/>
      <div className="flex flex-col lg:flex-row items-center border justify-center min-h-[70%]  gap-6 p-6">
      <motion.div 
  className="lg:w-2/3 w-full p-6 bg-white shadow-md rounded-md relative"
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
>
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-4 ">

      <div className=" relative flex items-center justify-center bg-red-600 text-white text-2xl font-bold rounded-full">
        {/* {formData.name.charAt(0).toUpperCase()} */}
        <ProfileAvatar keyword={selectedAvatar || userData?.profile} width="150px" height='150px' />
        {isEditing && <>
          <button 
  onClick={handleAvatarSelectorOpen}
  className="absolute top-12 right-12 text-yellow-400 hover:text-red-600 text-5xl font-extrabold"
>
  <FontAwesomeIcon icon={faEdit} className="text-4xl" />
</button>
        </>}
      </div>
      <h2 className="text-2xl font-bold">Profile Details</h2>
    </div>
    {
      !isEditing && <button
      onClick={ handleEditToggle}
      className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
    >
      <FontAwesomeIcon icon={faEdit} className="text-xl" />
    </button>
    }
    
  </div>
  <div className="space-y-4">
    {['name', 'email', 'phone', 'age', 'address'].map((field) => (
      <div key={field} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2">
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
          <p className="md:w-3/4 text-gray-700">{formData[field] || '—'}</p>
        )}
      </div>
    ))}
  </div>
  {
    isEditing && <button className='px-5 rounded-lg py-2 bg-yellow-400 hover:bg-red-600 text-white m-4'
    onClick={handleSave}>Save</button>
  }
  <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
    {/* <button
      onClick={() => {
        setIsModalOpen(true);
        // fetchBookings();
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
    >
      See My Bookings
    </button> */}
  </div>
</motion.div>


<div className="lg:w-1/3 w-full flex justify-center items-center h-screen">
  {bookings.length > 0 ? (
    <motion.ul 
      className="space-y-4 w-full p-6 bg-gray-100 rounded-lg shadow-xl overflow-y-auto h-[80%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {bookings.map((booking) => (
        <li key={booking.id} className="border border-gray-300 p-6 rounded-lg bg-white shadow-lg hover:shadow-2xl transition-shadow">
          <h3 className="text-xl font-bold text-blue-600 text-center mb-4">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Bus ID:</strong> {booking.busId || 'N/A'}</p>
            <p><strong>Seat(s):</strong> {booking.seatno?.join(', ') || 'N/A'}</p>
            <p><strong>Date:</strong> {booking.date || 'N/A'}</p>
          </div>
          <div className="mt-6 border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-700 text-center mb-4">Passenger Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Name:</strong> {booking.userDetails?.name || 'N/A'}</p>
              <p><strong>Age:</strong> {booking.userDetails?.age || 'N/A'}</p>
              <p><strong>Gender:</strong> {booking.userDetails?.gender || 'N/A'}</p>
              <p><strong>Aadhaar:</strong> {booking.userDetails?.adhaarCardNo || 'N/A'}</p>
              <p><strong>Phone:</strong> {booking.userDetails?.phoneNumber || 'N/A'}</p>
              <p><strong>Email:</strong> {booking.userDetails?.email || 'N/A'}</p>
            </div>
          </div>
        </li>
      ))}
    </motion.ul>
  ) : (
    <motion.div 
      className="text-center bg-gray-100 p-8 rounded-lg shadow-xl"
      initial={{ y: -10 }}
      animate={{ y: 10 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
    >
      <img src={noBookingsImage} alt="No bookings" className="w-48 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-800">No bookings right now!</h1>
      <p className="text-gray-600">Do bookings to view over here.</p>
      <button 
        onClick={() => navigate('/bookings')} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mt-6 transition-all"
      >
        Book Now
      </button>
    </motion.div>
  )}
</div>
<ModalUtil isOpen={isAvatarSelectorOpen} onClose={handleAvatarSelectorClose}>
<ProfileSelector onSelectAvatar={handleAvatarSelection} />
      

</ModalUtil>
      </div>
    </>
  );
};

export default Profile;
