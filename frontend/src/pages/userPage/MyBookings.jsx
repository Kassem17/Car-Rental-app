import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import useGetUserById from "../../hooks/useGetUserById";
import useGetBookingForUser from "../../hooks/useGetBookingForUser";
import useCancelBookingById from "../../hooks/useCancelBooking";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import axios from "axios";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-gray-100 text-gray-800",
  confirmed: "bg-blue-100 text-blue-800",
};

const MyBookings = () => {
  const { userById, bookingForUser, token, backendUrl } =
    useContext(AppContext);
  const { getUserById } = useGetUserById();
  const { getBookingByUser } = useGetBookingForUser();
  const { cancelBooking } = useCancelBookingById();
  // const { deleteBooking } = useDeleteBookings();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getUserById(token);
      getBookingByUser(token);
    }
  }, [token]);

  const handleCancelBooking = async (id) => {
    await cancelBooking({ bookingId: id });
  };

  // const handleDeleteCancelledBooking = async (id) => {
  //   await deleteBooking({ bookingId: id });
  // };

  const sortedBookings = useMemo(() => {
    const statusOrder = { pending: 0, confirmed: 1, paid: 2, cancelled: 3 };
    return [...bookingForUser].sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );
  }, [bookingForUser]);

  const handleCheckout = async ({ bookingId, amount }) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/payment/create-checkout-session",
        {
          bookingId,
          amount,
          currency: "usd",
        }
      );
      window.location.href = res.data.url; // Redirect to Stripe Checkout page
    } catch (err) {
      console.error("Error during checkout", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              My Bookings
            </h1>
            <p className="text-gray-500">Manage your reservations</p>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-100 w-full lg:w-auto">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                {userById.avatar ? (
                  <img
                    className="rounded-full h-full w-full object-cover"
                    src={userById.avatar}
                    alt={userById.name}
                    loading="lazy"
                  />
                ) : (
                  <span>{userById.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h2 className="font-medium text-gray-800 text-sm">
                  {userById.name}
                </h2>
                <p className="text-xs text-gray-500">{userById.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Bookings List */}
        <AnimatePresence>
          {sortedBookings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {sortedBookings.map((booking) => {
                const isConfirmed = booking.status === "confirmed";
                const isCancelled = booking.status === "cancelled";
                const isPaid = booking.status === "paid";
                const isPending = booking.status === "pending";

                return (
                  <motion.article
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-xl shadow-xs overflow-hidden border border-gray-100 ${
                      isCancelled ? "opacity-75" : "hover:shadow-sm"
                    }`}
                  >
                    <div className="p-4 md:flex md:items-center md:justify-between gap-4">
                      <div className="flex items-start space-x-3 mb-3 md:mb-0">
                        <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {new Date(booking.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            -{" "}
                            {new Date(booking.endDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </h3>
                          <p className="text-gray-500 text-xs mt-0.5">
                            ID: {booking._id.slice(-6).toUpperCase()}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                statusStyles[booking.status]
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                            {!isCancelled && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                ${booking.totalAmount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {isPaid && !isCancelled && (
                          <button
                            onClick={() =>
                              navigate(`/print-voucher/${booking._id}`)
                            }
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Print Voucher
                          </button>
                        )}

                        {isConfirmed && (
                          <button
                            onClick={() =>
                              handleCheckout({
                                bookingId: booking._id,
                                amount: booking.totalAmount,
                              })
                            }
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Pay Now
                          </button>
                        )}

                        {!isCancelled && !isPaid && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {/* {isCancelled && (
                          <button
                            onClick={() =>
                              handleDeleteCancelledBooking(booking._id)
                            }
                            className="px-3 py-1.5 bg-red-500 border border-gray-200 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        )} */}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xs p-6 text-center max-w-md mx-auto border border-gray-100"
            >
              <div className="mx-auto h-16 w-16 text-gray-300 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No bookings found
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                Start exploring our properties to book your stay.
              </p>
              <button
                onClick={() => navigate("/properties")}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Browse Properties
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center mt-20">
        <motion.button
          onClick={() => navigate("/all-Cars")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transition-all group"
        >
          Reserve
          <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

export default MyBookings;
