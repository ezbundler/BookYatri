import React, { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { fetchAllBooking, fetchbuses } from "../services/buses";
import { changeUserRole, fetchUser } from "../services/user";
import busImage from "../images/bus1.png";
import LoaderModal from "./Loader";

const ModalUtil = lazy(() => import("../utils.js/Modal"));
const ProfileAvatar = lazy(() => import("./ProfileAvatar"));
const Button = lazy(() => import("../utils.js/button"));
const UserListWithPagination = lazy(() => import("./UserPagination"));
const BusServiceForm = lazy(() => import("./BusServiceForm"));
const BusDetail = lazy(() => import("./BusDetail"));
const ExportButton = lazy(() => import("./Dataimport"));

const AdminHomePage = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState([]);
  const [booking, setBooking] = useState();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const [isBusCreationModalOpen, setIsBusCreationModalOpen] = useState(false);
  const [isBusDetailModalOpen, setIsBusDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
    fetchUsers();
  }, [isBusDetailModalOpen, isBusCreationModalOpen]);

  useEffect(() => {
    const getBooking = async () => {
      const res = await fetchAllBooking();
      setBooking(res.data);
    };
    getBooking();
  }, []);

  const fetchBuses = async () => {
    const buses = await fetchbuses();
    if (buses.statusCode !== 401) {
      setBuses(buses.buses);
      return;
    } else {
      toast.error(`${buses.error}`);
      return;
    }
  };

  const fetchUsers = async () => {
    const users = await fetchUser();
    if (users.statusCode === 201) {
      setUsers(users.data);
    } else {
      toast.error(`${users.error}. Please try again later`);
    }
  };

  const handleUserClick = (user) => {
    setIsUserListModalOpen(false);
    setSelectedUser(user);
  };

  const handleRoleChange = (newRole) => {
    setSelectedUser({ ...selectedUser, role: newRole });
  };

  const openUserListModal = () => {
    setIsUserListModalOpen(true);
  };

  const closeUserListModal = () => {
    setIsUserListModalOpen(false);
  };

  const handleSubmitRoleChange = async () => {
    const updatedUser = {
      ...selectedUser,
      role: selectedUser.role,
    };
    const response = await changeUserRole({ updatedUser });
    if (response.statusCode === 201) {
      const updatedUserData = await response.data.json();
      setSelectedUser(updatedUserData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUserData.id ? updatedUserData : user
        )
      );
      toast.success("User role updated successfully!");
    } else {
      toast.error(`Failed to update user role! ${response.error} `);
    }
  };

  const openBusCreationModel = () => {
    setIsBusCreationModalOpen(true);
  };

  const closeBusCreationModel = () => {
    setIsBusCreationModalOpen(false);
  };

  const openBusDetailModel = () => {
    setIsBusDetailModalOpen(true);
  };

  const closeBusDetailModel = () => {
    setIsBusDetailModalOpen(false);
  };

  return (
    <Suspense fallback={<LoaderModal/>}>
      <div className="p-6 min-h-screen flex flex-col md:flex-row">
        <div>
          <ExportButton bookings={booking} />
        </div>
        <div className="w-full md:w-2/3 p-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-6 text-left">Buses</h1>
            <button
              onClick={openBusCreationModel}
              className="mb-4 hover:bg-yellow-500 hover:text-white text-slate-400 p-2 rounded"
            >
              Add Bus
            </button>
          </div>
          <div className="grid gap-6">
            {buses.map((bus) => (
              <div
                onClick={() => {
                  openBusDetailModel();
                  setSelectedBus(bus);
                }}
                key={bus.id}
                className="bg-slate-200 shadow-md p-4 cursor-pointer flex md:flex-row-reverse flex-col-reverse justify-between items-center hover:bg-slate-100 hover:border-2 hover:border-yellow-300 rounded-lg"
              >
                <h2 className="text-xl font-semibold text-center w-full md:w-3/4 text-red-600 items-center justify-center mb-2">
                  <FontAwesomeIcon icon={faBus} />
                  {bus.name || "Bus Name"}
                </h2>
                <div className="w-full md:w-1/4 p-4 flex justify-center items-center md:h-40 mb-4 md:mb-0 h-40">
                  <img
                    src={busImage}
                    alt="Bus Illustration"
                    className="w-3/4 h-80 md:h-auto max-h-[400px] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 p-4">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold mb-4">User</h2>
            <Button
              onClick={openUserListModal}
              className="mb-4 hover:bg-yellow-500 hover:text-white text-slate-400 p-2 rounded"
              title="View All Users"
            />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {users.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="relative bg-white border-2 border-yellow-300 hover:border-red-600 shadow-lg p-6 rounded-lg cursor-pointer flex flex-col lg:flex-row gap-8 justify-center sm:justify-around items-center transition-transform transform hover:scale-105"
                onClick={() => handleUserClick(user)}
              >
                <ProfileAvatar
                  keyword={user?.profile || "default"}
                  width="100px"
                  height="100px"
                  className="mb-4 sm:mb-0"
                />

                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 sm:text-2xl">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1 sm:text-base">
                    {user.email}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {user.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ModalUtil isOpen={isUserListModalOpen} onClose={closeUserListModal}>
          <UserListWithPagination handleUserClick={handleUserClick} />
        </ModalUtil>

        <ModalUtil isOpen={isBusDetailModalOpen} onClose={closeBusDetailModel}>
          <BusDetail busId={selectedBus?.id} onClose={closeBusDetailModel} />
        </ModalUtil>

        <ModalUtil isOpen={isBusCreationModalOpen} onClose={closeBusCreationModel}>
          <BusServiceForm onClose={closeBusCreationModel} fetchbuses={fetchBuses} />
        </ModalUtil>

        {selectedUser && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <h2 className="text-xl font-bold mb-4">User Details</h2>
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>
              <p>Booked Ticket: {selectedUser.booked ? "Yes" : "No"}</p>

              {selectedUser.booked && (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  View Booked Seats
                </button>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium">Change Role:</label>
                <select
                  className="p-2 border rounded w-full"
                  value={selectedUser.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button
                className="mt-4 bg-green-500 m-3 text-white px-4 py-2 rounded"
                onClick={() => handleSubmitRoleChange()}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default AdminHomePage;
