import { useState, useEffect, useContext } from "react";
import * as XLSX from "xlsx";
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
  AreaChart,
  Area,
} from "recharts";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign as FiCash,
} from "react-icons/fi";
import { FiTruck as FiCar } from "react-icons/fi";
import { Star } from "react-feather";
import useCancelBookingById from "../../hooks/useCancelBooking";

const Dashboard = () => {
  const { users, dashboardCars, dashboardBookings, backendUrl, reviews } =
    useContext(AppContext);
  const { cancelBooking } = useCancelBookingById();

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    paidBookings: 0,
    totalRevenue: 0,
    totalCars: 0,
    reviews: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const itemsPerPage = 5;

  const generateMonthlyRevenue = (bookings) => {
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      revenue: 0,
    }));

    bookings.forEach((booking) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const isPaid = booking.status === "paid";
      const isInFuture = endDate >= today;

      if (isPaid && isInFuture) {
        let current = new Date(startDate);

        while (current <= endDate) {
          const monthIndex = current.getMonth();
          months[monthIndex].revenue += booking.totalAmount || 0;
          current.setMonth(current.getMonth() + 1);
          current.setDate(1);
        }
      }
    });

    return months;
  };

  useEffect(() => {
    setTimeout(() => {
      const confirmed = dashboardBookings.filter(
        (b) => b.status === "confirmed"
      );
      const pending = dashboardBookings.filter(
        (b) => b.status === "pending"
      ).length;
      const cancelled = dashboardBookings.filter(
        (b) => b.status === "cancelled"
      ).length;
      const paid = dashboardBookings.filter((b) => b.status === "paid");

      const totalPaidAmount = paid.reduce(
        (acc, booking) => acc + (booking.totalAmount || 0),
        0
      );

      setStats({
        totalUsers: users.length,
        totalBookings: dashboardBookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed.length,
        paidBookings: paid.length,
        cancelledBookings: cancelled,
        totalRevenue: totalPaidAmount,
        totalCars: dashboardCars.length,
        reviews: reviews.length,
      });

      setRevenueData(generateMonthlyRevenue(paid));
      setLoading(false);
    }, 1000);
  }, []);

  const handlePayCash = async (bookingId) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/pay-cash", {
        bookingId,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const bookingStatusData = [
    { name: "Paid", value: stats.paidBookings },
    { name: "Pending", value: stats.pendingBookings },
    { name: "Cancelled", value: stats.cancelledBookings },
    { name: "Confirmed", value: stats.confirmedBookings },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];
  const totalPages = Math.ceil(dashboardBookings.length / itemsPerPage);

  const sortedBookings = [...dashboardBookings].sort((a, b) => {
    const statusOrder = { pending: 0, confirmed: 1, paid: 2, cancelled: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleConfirmBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/confirm-booking",
        { bookingId }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/admin-cancel",
        { bookingId }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const exportToExcel = () => {
    // Prepare the data for Excel
    const excelData = sortedBookings.map((booking) => ({
      User: booking.user.name,
      Email: booking.user.email,
      Car: `${booking.car.brand} ${booking.car.model}`,
      "Plate Number": booking.car.plateNumber,
      "Start Date": new Date(booking.startDate).toLocaleDateString(),
      "End Date": new Date(booking.endDate).toLocaleDateString(),
      Amount: `$${booking.totalAmount}`,
      Status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Export the file
    XLSX.writeFile(
      workbook,
      `Bookings_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const [currentReviewPage, setReviewCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-500">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiUsers className="text-blue-500" size={24} />}
            title="Total Users"
            value={stats.totalUsers}
            change="+12%"
            onClick={() => navigate("/all-users")}
            color="blue"
          />
          <StatCard
            icon={<FiCalendar className="text-green-500" size={24} />}
            title="Total Bookings"
            value={stats.totalBookings}
            change="+5%"
            onClick={() =>
              document
                .getElementById("bookings")
                .scrollIntoView({ behavior: "smooth" })
            }
            color="green"
          />
          <StatCard
            icon={<FiCar className="text-purple-500" size={24} />}
            title="Total Cars"
            value={stats.totalCars}
            change="+3%"
            onClick={() => navigate("/cars")}
            color="purple"
          />
          <StatCard
            icon={<FiDollarSign className="text-amber-500" size={24} />}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change="+24%"
            color="amber"
          />

          <StatCard
            onClick={() => setIsOpen(true)}
            icon={<Star className="text-amber-500" size={24} />}
            title="Total Reviews"
            value={`${stats.reviews} ${
              stats.reviews.length === 1 ? "Review" : "Reviews"
            }`}
            color="amber"
          />
        </div>
        {/* Reviews Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Customer Reviews
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiXCircle size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No reviews available
                    </p>
                  ) : (
                    currentReviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {review.userName.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                {review.userName || "Anonymous"}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mt-2">
                              {review.comment}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* reviews pagination */}
                  {reviews.length > reviewsPerPage && (
                    <div className="flex justify-between items-center mt-4 px-6 pb-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="text-sm px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of{" "}
                        {Math.ceil(reviews.length / reviewsPerPage)}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              Math.ceil(reviews.length / reviewsPerPage)
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(reviews.length / reviewsPerPage)
                        }
                        className="text-sm px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Revenue Overview
              </h3>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 bg-white">
                <option>Last 12 Months</option>
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Status Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Booking Status
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Bookings
              </h3>
              <button
                onClick={exportToExcel}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export to Excel
              </button>
            </div>
          </div>
          <div id="bookings" className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["User", "Car", "Dates", "Amount", "Status", "Actions"].map(
                    (head, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {booking.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {booking.car?.brand} {booking.car?.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.car?.plateNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        to{" "}
                        {new Date(booking.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === "pending" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="flex items-center text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <FiCheckCircle className="mr-1" size={14} /> Confirm
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex items-center text-sm bg-red-50 text-red-700 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <FiXCircle className="mr-1" size={14} /> Cancel
                          </button>
                        </div>
                      ) : booking.status === "confirmed" ? (
                        <button
                          onClick={() => handlePayCash(booking._id)}
                          className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <FiCash className="mr-1" size={14} /> Pay Cash
                        </button>
                      ) : (
                        <span className="text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, dashboardBookings.length)}
              </span>{" "}
              of <span className="font-medium">{dashboardBookings.length}</span>{" "}
              bookings
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border text-sm ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, onClick, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer transition-all ${
        onClick ? "hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
      {change && (
        <p className="mt-3 text-sm font-medium">
          <span
            className={`${
              change.startsWith("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </span>{" "}
          <span className="text-gray-500">vs last month</span>
        </p>
      )}
    </motion.div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusClasses = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default Dashboard;
