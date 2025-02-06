import React, { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import noBookingsImage from "../images/logo2.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useDebounce } from "../utils.js/debounceHook";
import { fetchUser } from "../services/user";
import { fetchAllBooking } from "../services/buses";

const Navbar = lazy(() => import("../components/Navbar"));
const ModalUtil = lazy(() => import("../utils.js/Modal"));
const ProfileSelector = lazy(() => import("../components/ProfileSelector"));
const ProfileAvatar = lazy(() => import("../components/ProfileAvatar"));

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [user, setUser] = useState();
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isAvatarSelectorOpen, setisAvatarSelectorOpen] = useState(false);
  const [navbarImg, setnavbarIMg] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    profile: "default",
  });

  const debouncedFormData = useDebounce(formData);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    let parsedUser;
    if (userData) {
      parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    const fetchUserDetails = async () => {
      try {
        const users = await fetchUser();
        if (users.statusCode === 201) {
          const person = users.data.find((u) => u.email === parsedUser?.email);
          if (person) {
            setUserData(person);
            setFormData({
              name: person.name || "",
              email: person.email || "",
              phone: person.phone || "",
              age: person.age || "",
              address: person.address || "",
              profile: person.profile || "default",
            });
            setSelectedAvatar(person.profile);
          }
        } else {
          toast.error(`${users.error}. Please try again later`);
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    };
    fetchUserDetails();

    const fetchBookings = async () => {
      try {
        const bookings = await fetchAllBooking();
        const userbooking = bookings.data.filter(
          (b) => b.useremail === parsedUser?.email
        );
        setBookings(userbooking);
      } catch (error) {
        toast.error(`${error}`);
      }
    };
    fetchBookings();
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
      const response = await fetch(
        `http://localhost:5000/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            ...debouncedFormData,
            profile: selectedAvatar || userData.person,
          }),
        }
      );
      if (response.ok) {
        setUserData({ ...userData, ...debouncedFormData });
        setIsEditing(false);
        setnavbarIMg(!navbarImg);
      }

      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...userData,
          ...formData,
          profile: selectedAvatar || userData.person,
        })
      );
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAvatarSelectorOpen = () => {
    setisAvatarSelectorOpen(true);
  };

  const handleAvatarSelectorClose = () => {
    setisAvatarSelectorOpen(false);
  };

  const handleAvatarSelection = (keyword) => {
    setSelectedAvatar(keyword);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar profilepic={navbarImg} />
      <div className="flex flex-col lg:flex-row items-center border justify-center min-h-[70%] gap-6 p-6">
        <motion.div
          className="lg:w-2/3 w-full p-6 bg-white shadow-md rounded-md relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 ">
              <div className="relative flex items-center justify-center bg-red-600 text-white text-2xl font-bold rounded-full">
                <ProfileAvatar
                  keyword={selectedAvatar || userData?.profile}
                  width="150px"
                  height="150px"
                />
                {isEditing && (
                  <>
                    <button
                      onClick={handleAvatarSelectorOpen}
                      className="absolute top-12 right-12 text-yellow-400 hover:text-red-600 text-5xl font-extrabold"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-4xl" />
                    </button>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold">Profile Details</h2>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
              >
                <FontAwesomeIcon icon={faEdit} className="text-xl" />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {["name", "email", "phone", "age", "address"].map((field) => (
              <div
                key={field}
                className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2"
              >
                <label className="block font-medium capitalize md:w-1/4">
                  {field}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded md:w-3/4"
                  />
                ) : (
                  <p className="md:w-3/4 text-gray-700">
                    {formData[field] || "—"}
                  </p>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <button
              className="px-5 rounded-lg py-2 bg-yellow-400 hover:bg-red-600 text-white m-4"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </motion.div>

        <div className="lg:w-1/3 w-full flex justify-center items-center h-screen">
          {bookings.length > 0 ? (
            <motion.ul
              className="space-y-4 w-full p-6 bg-gray-100 rounded-lg shadow-xl overflow-y-auto h-[80%] sm:p-4 md:p-6 lg:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="border border-gray-300 p-6 rounded-lg bg-white shadow-lg hover:shadow-2xl transition-shadow sm:p-4 md:p-6 lg:p-8"
                >
                  <h3 className="text-xl font-bold text-blue-600 text-center mb-4 sm:text-lg md:text-xl lg:text-2xl">
                    Booking Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    <p>
                      <strong>Bus ID:</strong> {booking.busId || "N/A"}
                    </p>
                    <p>
                      <strong>Seat(s):</strong> {booking.seatno?.join(", ") || "N/A"}
                    </p>
                    <p>
                      <strong>Date:</strong> {booking.date || "N/A"}
                    </p>
                  </div>
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-700 text-center mb-4 sm:text-base md:text-lg lg:text-xl">
                      Passenger Info
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      <p>
                        <strong>Name:</strong> {booking.userDetails?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Age:</strong> {booking.userDetails?.age || "N/A"}
                      </p>
                      <p>
                        <strong>Gender:</strong> {booking.userDetails?.gender || "N/A"}
                      </p>
                      <p>
                        <strong>Aadhaar:</strong> {booking.userDetails?.adhaarCardNo || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {booking.userDetails?.phoneNumber || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {booking.userDetails?.email || "N/A"}
                      </p>
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
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1,
              }}
            >
              <img
                src={noBookingsImage}
                alt="No bookings"
                className="w-48 mx-auto mb-6"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                No bookings right now!
              </h1>
              <p className="text-gray-600">Do bookings to view over here.</p>
              <button
                onClick={() => navigate("/home")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mt-6 transition-all"
              >
                Book Now
              </button>
            </motion.div>
          )}
        </div>

        <Suspense fallback={<div>Loading Avatar Selector...</div>}>
          <ModalUtil isOpen={isAvatarSelectorOpen} onClose={handleAvatarSelectorClose}>
            <ProfileSelector onSelectAvatar={handleAvatarSelection} />
          </ModalUtil>
        </Suspense>
      </div>
    </Suspense>
  );
};

export default Profile;
