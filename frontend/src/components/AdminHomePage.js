import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faCheckCircle,
  faTimesCircle,
  faChair,
} from "@fortawesome/free-solid-svg-icons";
import ModalUtil from "../utils.js/Modal";
import ProfileAvatar from "./ProfileAvatar";
import { fetchbuses } from "../services/buses";
import { toast } from "react-toastify";
import { changeUserRole, fetchUser } from "../services/user";
import Button from "../utils.js/button";
import UserListWithPagination from "./UserPagination";
import BusServiceForm from "./BusServiceForm";

const AdminHomePage = () => {
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const [isBusCreationModalOpen, setIsBusCreationModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBuses();
    fetchUsers();
  }, []);

  const fetchBuses = async () => {
    const buses = await fetchbuses();
    if (buses.statusCode !== 401) {
      setBuses(buses.buses);
      console.log(buses.buses,"buses data for the new creation and checking");
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


const openBusCreationModel = ()=>{
setIsBusCreationModalOpen(true);
}
const closeBusCreationModel = ()=>{
setIsBusCreationModalOpen(false);
}



//   const handleNewBusCreation = (busData)=>{
// console.log(busData,"busdata in the creation of the new bus");

//   }

  return (
    <div className="p-6 min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 p-4">
      <div className="flex justify-between">

        <h1 className="text-3xl font-bold mb-6 text-left">Buses</h1>
        <button onClick={openBusCreationModel} className="mb-4 hover:bg-yellow-500 hover:text-white text-slate-400 p-2 rounded">Add A bus</button>

      </div>
        <div className="grid gap-6">
          {buses.map((bus) => {
            let totalseat = bus.UpperSeats?.length || 0 + bus.LowerSeats.length;
            let bookedSeat =
              bus.UpperSeats?.filter((u) => u.booked === true).length ||
              0 + bus.LowerSeats?.filter((l) => l.booked === true).length;
            let unbookedSeat = totalseat - bookedSeat;

            return (
              <div
                onClick={() => navigate(`/seatBooking/${bus.id}`)}
                key={bus.id}
                className="bg-slate-200 shadow-md p-4 cursor-pointer hover:bg-slate-100 hover:border-2 hover:border-yellow-300 rounded-lg"
              >
                <h2 className="text-xl font-semibold text-center text-red-600  mb-2">
                  <FontAwesomeIcon icon={faBus} />
                  {bus.name || "Bus Name"}
                </h2>
                <div className="flex gap-5 items-center ">
                  <p className="mt-4 font-medium">
                    <FontAwesomeIcon icon={faChair} /> {totalseat}
                  </p>
                  <p className="mt-4 font-medium">
                    {" "}
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      style={{ color: "red" }}
                    />{" "}
                    {bookedSeat}
                  </p>
                  <p className="mt-4 font-medium">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={{ color: "green" }}
                    />
                    : {unbookedSeat}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full md:w-1/3 p-4">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold mb-4">User </h2>
          <Button
            onClick={openUserListModal}
            className="mb-4 hover:bg-yellow-500 hover:text-white text-slate-400 p-2 rounded"
            title="View All Users"
          />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {users.slice(0, 4).map((user) => (
           <div
           key={user.id}
           className="relative bg-white border-2 border-yellow-300 hover:border-red-600 shadow-lg p-6 rounded-lg cursor-pointer flex flex-col lg:flex-row gap-8 justify-center sm:justify-around items-center transition-transform transform hover:scale-105"
           onClick={() => handleUserClick(user)}
         >
           <ProfileAvatar
             keyword={user?.profile || "default"}
             width="100px"
             height="100px"
             className="mb-4 sm:mb-0" // margin for small screens to separate avatar
           />
         
           <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
             <h3 className="text-xl font-bold text-gray-800 mb-2 sm:text-2xl">
               {user.name}
             </h3>
             <p className="text-gray-600 text-sm mb-1 sm:text-base">{user.email}</p>
             <p className="text-gray-600 text-sm sm:text-base">{user.phone}</p>
           </div>
         </div>
         
          ))}
        </div>
      </div>

      <ModalUtil isOpen={isUserListModalOpen} onClose={closeUserListModal}>
        <UserListWithPagination handleUserClick={handleUserClick} />
      </ModalUtil>
      
      <ModalUtil isOpen={isBusCreationModalOpen} onClose={closeBusCreationModel}>
       <BusServiceForm onClose={closeBusCreationModel} />
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
              submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;
