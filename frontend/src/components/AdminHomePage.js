import React, { useEffect, useState } from "react";

import "chart.js/auto";
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

const AdminHomePage = () => {
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBuses();
    fetchUsers();
  }, []);

  const fetchBuses = async () => {
    const response = await fetch("http://localhost:5000/buses");
    const data = await response.json();
    setBuses(data);
  };

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleUserClick = (user) => {
    setIsUserListModalOpen(false);
    setSelectedUser(user);
  };

  const handleRoleChange = (newRole) => {
    setSelectedUser({ ...selectedUser, role: newRole });
    console.log(selectedUser, "userrole changing check");
  };

  const openUserListModal = () => {
    setIsUserListModalOpen(true);
  };

  const closeUserListModal = () => {
    setIsUserListModalOpen(false);
  };

  const handleSubmitRoleChange = async () => {
    console.log(
      selectedUser,
      "last time checking while saving the detail change"
    );
    try {
      const updatedUser = {
        ...selectedUser,
        role: selectedUser.role,
      };

      const response = await fetch(
        `http://localhost:5000/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();

        setSelectedUser(updatedUserData);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUserData.id ? updatedUserData : user
          )
        );
        alert("User role updated successfully!");
      } else {
        console.error("Failed to update user");
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user role");
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col sm:flex-row">
      <div className="w-full sm:w-2/3 p-4">
        <h1 className="text-3xl font-bold mb-6 text-left">Buses</h1>
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

     
      <div className="w-full sm:w-1/3 p-4">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold mb-4">User </h2>
          <button
            onClick={openUserListModal}
            className="mb-4 hover:bg-yellow-500 hover:text-white text-slate-400 p-2 rounded"
          >
            View All Users
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
  {users.slice(0, 4).map((user) => (
    <div
      key={user.id}
      className="relative bg-white border-2 border-yellow-300 hover:border-red-600 shadow-lg p-6 rounded-lg cursor-pointer flex gap-8 justify-around transition-transform transform hover:scale-105"
      onClick={() => handleUserClick(user)}
    >
        <ProfileAvatar keyword={user?.profile || "default"} width="100px" height='100px' />

      <div className="flex flex-col items-center text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
      <p className="text-gray-600 text-sm mb-1">{user.email}</p>
      <p className="text-gray-600 text-sm">{user.phone}</p>
      </div>
     
    </div>
  ))}
</div>

      </div>

      <ModalUtil isOpen={isUserListModalOpen} onClose={closeUserListModal}>
      <div className="grid grid-cols-1 gap-6">
  {users?.map((user) => (
    <div
    key={user.id}
    className="relative bg-white border-2 border-yellow-300 hover:border-red-600 shadow-lg p-6 rounded-lg cursor-pointer flex gap-8 justify-around transition-transform transform hover:scale-105"
    onClick={() => handleUserClick(user)}
  >
      <ProfileAvatar keyword={user?.profile || "default"} width="100px" height='100px' />

    <div className="flex flex-col items-center text-center">
    <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
    <p className="text-gray-600 text-sm mb-1">{user.email}</p>
    <p className="text-gray-600 text-sm">{user.phone}</p>
    </div>
   
  </div>
  ))}
</div>
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
