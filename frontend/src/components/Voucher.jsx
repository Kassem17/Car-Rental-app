import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { extractTime } from "../utils/extractTime";

const Voucher = () => {
  const { backendUrl } = useContext(AppContext);
  const [booking, setBooking] = useState({});
  const { id } = useParams();

  const formattedDate = (date) => {
    const startDate = extractTime(booking?.startDate);
    const endDate = extractTime(booking?.endDate);
    return `${startDate} - ${endDate}`;
  };

  useEffect(() => {
    const getBookingById = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + `/api/booking/get-booking-by-id/` + id
        );
        if (data.success) {
          setBooking(data.booking);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    };
    getBookingById();
  }, [id]);

  const voucherRef = useRef();

  const handlePrint = () => {
    const printContents = voucherRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // to reload the page if needed
  };

  return (
    <div className="p-8">
      {/* Voucher Section */}
      <div
        ref={voucherRef}
        className="max-w-2xl mx-auto p-8 border border-gray-300 rounded-lg bg-white text-black"
      >
        {/* Your voucher content here */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Booking Voucher</h1>
          <p className="text-sm text-gray-600">Thank you for your booking!</p>
        </div>

        <div className="mb-6">
          <img
            src={booking?.car?.carImage}
            alt="Car"
            className="w-full h-60 object-cover rounded-md border"
          />
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span>${booking?.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Booking Date:</span>
            <span>{formattedDate()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Payment ID:</span>
            <span>{booking?.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span className="text-green-500 text-xl font-semibold">Booked</span>
          </div>
        </div>

        <div className="border-t pt-6 space-y-3">
          <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
          <div className="flex items-center gap-4">
            <img
              src={booking?.user?.avatar}
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div className="space-y-1">
              <p className="font-medium">{booking?.user?.name}</p>
              <p className="text-sm text-gray-600">{booking?.user?.email}</p>
              <p className="text-sm text-gray-600">
                {booking?.user?.phoneNumber}
              </p>
            </div>
          </div>
        </div>
        {/* Print Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Print Voucher
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
