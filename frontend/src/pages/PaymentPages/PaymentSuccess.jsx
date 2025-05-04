import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/payment/verify-payment",
          {
            sessionId,
          }
        );

        if (response.data.success) {
          alert("Payment verified and booking confirmed!");
        } else {
          alert("Payment verification failed!");
        }
      } catch (err) {
        console.error("Error verifying payment", err);
        alert("Error verifying payment!");
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-r from-green-50 to-green-100 text-center px-4">
      <CheckCircle className="text-green-600" size={72} />
      <h1 className="text-3xl md:text-4xl font-bold mt-4 text-green-700">
        Payment Successful!
      </h1>
      <p className="mt-3 text-lg text-gray-700 max-w-xl">
        Thank you for your payment. Your booking has been confirmed. A
        confirmation email will be sent to you shortly.
      </p>
      <Link
        to="/my-bookings"
        className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition duration-300"
      >
        View My Bookings
      </Link>
    </div>
  );
};

export default PaymentSuccess;
