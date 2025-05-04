import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-r from-red-50 to-red-100 text-center px-4">
      <XCircle className="text-red-600" size={72} />
      <h1 className="text-3xl md:text-4xl font-bold mt-4 text-red-700">
        Payment Cancelled
      </h1>
      <p className="mt-3 text-lg text-gray-700 max-w-xl">
        Your payment was not completed. You can try again or contact support if
        you believe this is a mistake.
      </p>
      <Link
        to="/my-bookings"
        className="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition duration-300"
      >
        Back to My Bookings
      </Link>
    </div>
  );
};

export default PaymentCancelled;
