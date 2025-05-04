import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { extractTime } from "../../utils/extractTime";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiSearch,
  FiX,
  FiPhone,
} from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";

const AllUsers = () => {
  const { users, backendUrl } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [bookingsData, setBookingsData] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const usersPerPage = 10;

  // Filter users by name (case insensitive)
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch bookings data when modal opens
  const fetchBookings = async (bookingIds) => {
    setLoadingBookings(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/booking/get-multiple`,
        { bookingIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setBookingsData(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load booking details");
      setBookingsData([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Show bookings modal
  const handleShowBookings = (user) => {
    setSelectedUser(user);
    setShowBookingsModal(true);
    setBookingsData([]);

    if (user.bookings?.length > 0) {
      fetchBookings(user.bookings);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    User
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiPhone className="mr-2" />
                    Phone Number
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiMail className="mr-2" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <HiOutlineBookOpen className="mr-2" />
                    Bookings
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    Joined
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover shadow-sm"
                            src={user.avatar || "/default-avatar.png"}
                            alt={user.name}
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {user.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phoneNumber ? (
                        <span className="text-xl text-gray-600">
                          {user.phoneNumber}
                        </span>
                      ) : (
                        <span className="text-xl text-gray-600">
                          xx-xxx xxx
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handleShowBookings(user)}
                    >
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.bookings?.length > 0
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.bookings?.length || 0} bookings
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1.5 text-gray-400" />
                        {extractTime(user.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <>
                          No users found matching "
                          <span className="font-medium">{searchTerm}</span>"
                        </>
                      ) : (
                        "No users available"
                      )}
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredUsers.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-1 rounded-md border text-sm ${
                      currentPage === pageNumber
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Modal */}
      {showBookingsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bookings for {selectedUser.name}
                </h3>
                <button
                  onClick={() => setShowBookingsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {loadingBookings ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading bookings...</p>
                </div>
              ) : bookingsData.length > 0 ? (
                <div className="space-y-3">
                  {bookingsData.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500">Booking ID</p>
                          <p className="text-sm font-mono text-blue-600">
                            {booking._id}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            booking.status === "confirmed"
                              ? "bg-green-500 text-white"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : booking.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Car</p>
                          <p className="text-sm">
                            {booking.car?.brand} {booking.car?.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dates</p>
                          <p className="text-sm">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-sm font-medium">
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedUser.bookings?.length > 0
                    ? "Could not load booking details"
                    : "No bookings found for this user"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
