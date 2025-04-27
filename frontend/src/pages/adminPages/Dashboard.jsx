import { useState, useEffect, useContext } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { users, dashboardCars, dashboardBookings } = useContext(AppContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalCars: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const generateMonthlyRevenue = (bookings) => {
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      revenue: 0,
    }));

    bookings.forEach((booking) => {
      const endDate = new Date(booking.endDate);
      const isConfirmed = booking.status === "completed";
      const isInFuture = endDate >= today;

      if (isConfirmed && isInFuture) {
        const monthIndex = endDate.getMonth();
        months[monthIndex].revenue += booking.totalAmount || 0;
      }
    });

    return months;
  };

  useEffect(() => {
    setTimeout(() => {
      const confirmed = dashboardBookings.filter(
        (b) => b.status === "completed"
      );
      const pending = dashboardBookings.filter(
        (b) => b.status === "pending"
      ).length;
      const cancelled = dashboardBookings.filter(
        (b) => b.status === "cancelled"
      ).length;

      const totalConfirmedAmount = confirmed.reduce(
        (acc, booking) => acc + (booking.totalAmount || 0),
        0
      );

      setStats({
        totalUsers: users.length,
        totalBookings: dashboardBookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed.length,
        cancelledBookings: cancelled,
        totalRevenue: totalConfirmedAmount,
        totalCars: dashboardCars.length,
      });

      setRevenueData(generateMonthlyRevenue(confirmed));
      setLoading(false);
    }, 1000);
  }, []);

  const handleAction = (bookingId, action) => {
    console.log(`${action} booking ${bookingId}`);
    // Integrate with API here
  };

  const bookingStatusData = [
    { name: "Confirmed", value: stats.confirmedBookings },
    { name: "Pending", value: stats.pendingBookings },
    { name: "Cancelled", value: stats.cancelledBookings },
  ];

  const COLORS = ["#34D399", "#FBBF24", "#F87171"];
  const totalPages = Math.ceil(dashboardBookings.length / itemsPerPage);

  const sortedBookings = [...dashboardBookings].sort((a, b) => {
    const statusOrder = { pending: 0, completed: 1, cancelled: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            onClick={() => navigate("/all-users")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={0.1}
            className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300`}
          >
            <p className="text-indigo-500 text-xl font-semibold mb-1">
              Total Users
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.totalUsers}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={0.1}
            className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300`}
          >
            <p className="text-indigo-500 text-xl font-semibold mb-1">
              Total Bookings
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.totalBookings}
            </h3>
          </motion.div>

          <motion.div
            onClick={() => navigate("/cars")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={0.1}
            className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300`}
          >
            <p className="text-indigo-500 text-xl font-semibold mb-1">
              Total Cars
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.totalCars}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={0.1}
            className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300`}
          >
            <p className="text-indigo-500 text-xl font-semibold mb-1">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </h3>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Booking Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {bookingStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Revenue
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#6366F1" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Bookings
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {[
                      "User",
                      "Car",
                      "Dates",
                      "Amount",
                      "Status",
                      "Actions",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {booking.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* {booking.car.brand} - {booking.car.model} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleAction(booking._id, "confirm")
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleAction(booking._id, "cancel")
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end px-6 py-4 bg-gray-50">
            <nav
              className="inline-flex rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border text-sm font-medium ${
                      currentPage === page
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </nav>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
