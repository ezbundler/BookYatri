import React, { useState, useEffect } from "react";
import { fetchPaginatedUsers } from "../services/user";
import ProfileAvatar from "./ProfileAvatar";
 // Ensure correct path

const UserListWithPagination = ({handleUserClick}) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 4;

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, total } = await fetchPaginatedUsers(page, pageSize);
        setUsers(data);
        setTotalUsers(total);
      } catch (err) {
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4">
        {users.map((user) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-md disabled:opacity-50 text-sm sm:text-base md:text-lg"
  >
    Previous
  </button>

  <span className="text-sm sm:text-base md:text-lg font-semibold">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
    disabled={page === totalPages}
    className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-md disabled:opacity-50 text-sm sm:text-base md:text-lg"
  >
    Next
  </button>
</div>

    </div>
  );
};

export default UserListWithPagination;
