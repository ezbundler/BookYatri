// import React, { useEffect, useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import 'chart.js/auto';

// const AdminHomePage = () => {
//   const [buses, setBuses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     fetchBuses();
//     fetchUsers();
//   }, []);

//   const fetchBuses = async () => {
//     const response = await fetch('http://localhost:5000/buses');
//     const data = await response.json();
//     setBuses(data);
//   };

//   const fetchUsers = async () => {
//     const response = await fetch('http://localhost:5000/users');
//     const data = await response.json();
//     setUsers(data);
//   };

//   const handleUserClick = (user) => {
//     setSelectedUser(user);
//   };

//   const handleRoleChange = (newRole) => {
//     setSelectedUser({ ...selectedUser, role: newRole });
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

//       {/* Bus Section */}
//       <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
//         {buses.map((bus) => (
//           <div key={bus.id} className="bg-white shadow-md p-4 rounded-lg">
//             <h2 className="text-xl font-semibold text-center mb-2">{bus.name}</h2>
//             <div className="flex flex-col items-center">
//               <Pie
//                 data={{
//                   labels: ['Booked', 'Available'],
//                   datasets: [
//                     {
//                       data: [bus.bookedSeats, bus.totalSeats - bus.bookedSeats],
//                       backgroundColor: ['#f87171', '#34d399'],
//                     },
//                   ],
//                 }}
//               />
//               <p className="mt-4 font-medium">Total Seats: {bus.totalSeats}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* User Management Section */}
//       <h2 className="text-2xl font-bold mt-10 mb-4">User Management</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {users.slice(0, 4).map((user) => (
//           <div
//             key={user.id}
//             className="bg-white shadow-md p-4 rounded-lg cursor-pointer"
//             onClick={() => handleUserClick(user)}
//           >
//             <h3 className="text-lg font-semibold">{user.name}</h3>
//             <p>{user.email}</p>
//             <p>{user.phone}</p>
//           </div>
//         ))}
//       </div>

//       {/* User Details Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">User Details</h2>
//             <p>Name: {selectedUser.name}</p>
//             <p>Email: {selectedUser.email}</p>
//             <p>Role: {selectedUser.role}</p>
//             <p>Booked Ticket: {selectedUser.booked ? 'Yes' : 'No'}</p>

//             {selectedUser.booked && (
//               <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
//                 View Booked Seats
//               </button>
//             )}

//             <div className="mt-4">
//               <label className="block text-sm font-medium">Change Role:</label>
//               <select
//                 className="p-2 border rounded w-full"
//                 value={selectedUser.role}
//                 onChange={(e) => handleRoleChange(e.target.value)}
//               >
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <button
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//               onClick={() => setSelectedUser(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminHomePage;


import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminHomePage = () => {
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

  useEffect(() => {
    fetchBuses();
    fetchUsers();
  }, []);

  const fetchBuses = async () => {
    const response = await fetch('http://localhost:5000/buses');
    const data = await response.json();
    setBuses(data);
  };

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:5000/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleRoleChange = (newRole) => {
    setSelectedUser({ ...selectedUser, role: newRole });
    console.log(selectedUser,"userrole changing check");
  };

  const openUserListModal = () => {
    setIsUserListModalOpen(true);
  };

  const closeUserListModal = () => {
    setIsUserListModalOpen(false);
  };

  const handleSubmitRoleChange = async () => {
    console.log(selectedUser,"last time checking while saving the detail change")
    try {
      const updatedUser = {
        ...selectedUser, // include all fields of the selected user
        role: selectedUser.role, // updated role value
      };
  
      const response = await fetch(`http://localhost:5000/users/${selectedUser.id}`, {
        method: 'PUT', // Use PUT for updating existing resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser), // Send the updated user data
      });
  
      if (response.ok) {
        const updatedUserData = await response.json();
        // Once updated, replace the selectedUser with updated data
        setSelectedUser(updatedUserData);
        // Optionally, update the users list with the new data
        setUsers((prevUsers) => 
          prevUsers.map((user) =>
            user.id === updatedUserData.id ? updatedUserData : user
          )
        );
        alert('User role updated successfully!');
      } else {
        console.error('Failed to update user');
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user role');
    }
  };
  


  return (
    <div className="p-6 min-h-screen flex flex-col sm:flex-row">
    {/* Bus Section */}
    <div className="w-full sm:w-2/3 p-4">
      <h1 className="text-3xl font-bold mb-6 text-left">Buses</h1>
      <div className="grid gap-6">
        {buses.map((bus) => (
          <div key={bus.id} className="dark:bg-purple-300 shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-center border-orange-300 border mb-2">{bus.name || "Bus Name"}</h2>
            <div className="flex flex-col items-center border">
              <p className="mt-4 font-medium">Total Seats: {bus.totalSeats}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  
    {/* User List */}
    <div className="w-full sm:w-1/3 p-4">
      <button
        onClick={openUserListModal}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
      >
        View All Users
      </button>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="grid grid-cols-1 gap-4">
        {users.slice(0, 4).map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.phone}</p>
          </div>
        ))}
      </div>
    </div>
  
    {/* User List Modal */}
    {isUserListModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-md p-4 rounded-lg cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p>{user.email}</p>
              </div>
            ))}
          </div>
          <button
            onClick={closeUserListModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    )}
  
    {/* User Details Modal */}
    {selectedUser && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Role: {selectedUser.role}</p>
          <p>Booked Ticket: {selectedUser.booked ? 'Yes' : 'No'}</p>
  
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
            onClick={() =>handleSubmitRoleChange()}
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

