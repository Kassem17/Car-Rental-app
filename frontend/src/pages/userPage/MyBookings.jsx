import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import useGetUserById from "../../hooks/useGetUserById";
import useGetBookingForUser from "../../hooks/useGetBookingForUser";
import useCancelBookingById from "../../hooks/useCancelBooking";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";

// const stripePromise = loadStripe(import.meta.env.VITE_Stripe_Publishable_key);

const MyBookings = () => {
  const { userById, bookingForUser, token } = useContext(AppContext);
  const { getUserById } = useGetUserById();
  const { getBookingByUser } = useGetBookingForUser();
  const { cancelBooking } = useCancelBookingById();

  useEffect(() => {
    getUserById(token);
    getBookingByUser(token);
  }, [token]);

  const handleCancelBooking = async (id) => {
    await cancelBooking({ bookingId: id });
  };

  // const handleStripePayment = async (booking) => {
  //   try {
  //     const stripe = await stripePromise;

  //     const response = await axios.post(
  //       backendUrl + "/stripe/create-checkout-session",
  //       {
  //         bookingId: booking._id,
  //         amount: booking.totalAmount,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     window.location.href = response.data.url;
  //   } catch (error) {
  //     console.error("Stripe Checkout error:", error);
  //   }
  // };

  // Sorting bookings: pending > completed > cancelled
  const sortedBookings = [...bookingForUser].sort((a, b) => {
    const statusOrder = { pending: 0, completed: 1, cancelled: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              My Bookings
            </h1>
            <p className="text-indigo-700">
              View and manage all your reservations
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md mt-4 md:mt-0">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-bold text-xl">
                  {userById.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{userById.name}</h2>
                <p className="text-sm text-gray-600">{userById.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking) => {
              const isCancelled = booking.status === "cancelled";

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                    isCancelled ? "opacity-60" : ""
                  }`}
                >
                  <div className="p-6 md:flex md:items-center md:justify-between ">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </h3>
                          <p className="text-gray-600">
                            Booking ID: {booking._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-2xl font-bold text-indigo-700 mb-1 ${
                          isCancelled ? "line-through" : ""
                        }`}
                      >
                        ${booking.totalAmount}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    {/* pay button */}
                    <button
                      // onClick={() => handleStripePayment(booking)}
                      className={`font-medium text-sm ${
                        booking.status === "completed"
                          ? " cursor-not-allowed text-green-600"
                          : "text-indigo-600 hover:text-indigo-800"
                      }`}
                      disabled={booking.status === "completed"}
                    >
                      {booking.status === "completed" && !isCancelled
                        ? "Paid"
                        : `Pay Online $${booking.totalAmount}`}
                    </button>

                    {/* cancel button */}
                    {booking.status !== "completed" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className={`ml-4 font-medium text-sm ${
                          isCancelled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                        disabled={isCancelled}
                      >
                        {isCancelled ? "Cancelled" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mt-4">
                No bookings found
              </h3>
              <p className="text-gray-500 mt-2">
                You don't have any bookings yet. Start exploring to make your
                first reservation!
              </p>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium">
                Browse Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
