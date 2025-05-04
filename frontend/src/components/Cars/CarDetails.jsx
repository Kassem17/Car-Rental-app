import React, { useContext, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Fuel,
  Star,
  Info,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useGetSpecificCar from "../../hooks/useGetSpecificCar";
import useCreateBooking from "../../hooks/useCreateBooking";
import useGetBookingForUser from "../../hooks/useGetBookingForUser";
import useGetUserById from "../../hooks/useGetUserById";
import useGetCarBooking from "../../hooks/useGetCarBooking";

const CarDetails = () => {
  const {
    specificCar,
    userById,
    bookingForUser,
    token,
    bookingByCar,
    unavailableCar,
  } = useContext(AppContext);
  const { carId } = useParams();
  const { getSpecificCar, loading } = useGetSpecificCar();
  const { createBooking, createLoading } = useCreateBooking();
  const { getBookingByUser } = useGetBookingForUser();
  const { getUserById } = useGetUserById();
  const { getBookingByCarId } = useGetCarBooking();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedDescription, setExpandedDescription] = useState(false);

  const totalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max((end - start) / (1000 * 60 * 60 * 24), 0);
  }, [startDate, endDate]);

  const totalAmount = useMemo(
    () => totalDays * (specificCar?.pricePerDay || 0),
    [totalDays, specificCar]
  );

  const isCarAvailable = useMemo(
    () => !unavailableCar.includes(specificCar?._id),
    [specificCar, unavailableCar]
  );

  const userBookingForThisCar = useMemo(
    () =>
      bookingForUser?.find(
        (b) =>
          (b.car === specificCar?._id || b.car?._id === specificCar?._id) &&
          b.user === userById?._id &&
          b.status !== "cancelled"
      ),
    [bookingForUser, specificCar, userById]
  );

  useEffect(() => {
    if (token) {
      getBookingByUser();
      getUserById();
    }
    if (carId) {
      getSpecificCar(carId);
      getBookingByCarId(carId);
    }
  }, [carId, token]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    await createBooking({
      carId: specificCar._id,
      startDate,
      endDate,
      totalAmount,
    });
  };

  const renderCalendar = () => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay()));
    return Array.from({ length: 35 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);

      const isBooked = bookingByCar?.some(({ startDate, endDate }) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return date >= start && date <= end;
      });

      const isPast = date < new Date();

      return (
        <div
          key={`calendar-${i}`}
          className={`p-1 text-sm rounded text-center ${
            isBooked
              ? "bg-red-200 text-red-800"
              : isPast
              ? "text-gray-300"
              : "text-gray-700 hover:bg-blue-100 cursor-pointer"
          }`}
        >
          {date.getDate()}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* LEFT COLUMN: Image + Bookings */}
          <div className="bg-gray-100 flex flex-col justify-start">
            <div className="h-80 flex items-center justify-center">
              <img
                src={specificCar?.carImage}
                alt={`${specificCar?.brand} ${specificCar?.model}`}
                className="object-contain h-full"
              />
            </div>

            {/* New: Booking List Below Image */}
            <div className="border-t mt-4 pt-4 px-4">
              <h4 className="text-md font-semibold mb-2">Current Bookings</h4>
              {bookingByCar?.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-auto pr-2 text-sm">
                  {bookingByCar.map((booking, i) => (
                    <li
                      key={`booking-${i}`}
                      className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded shadow-sm border"
                    >
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <CheckCircle className="text-green-500" size={16} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No bookings yet for this car.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Car Details */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">
                  {specificCar?.brand} {specificCar?.model}
                </h2>
                <p className="text-sm text-gray-500">{specificCar?.year}</p>
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  isCarAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isCarAvailable ? "Available" : "Booked"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }
                />
              ))}
              <span className="text-xs text-gray-500">(24 reviews)</span>
            </div>

            <p className="text-xl font-bold text-blue-600">
              ${specificCar?.pricePerDay} <span className="text-sm">/day</span>
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Fuel size={18} /> {specificCar?.fuelType}
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} /> {specificCar?.seats} Seats
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-1 flex items-center gap-1">
                <Info size={16} /> About
              </h4>
              <p className={expandedDescription ? "" : "line-clamp-3"}>
                {specificCar?.description}
              </p>
              <button
                className="text-blue-500 text-xs mt-1"
                onClick={() => setExpandedDescription((prev) => !prev)}
              >
                {expandedDescription ? "Show less" : "Read more"}
              </button>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                min={
                  new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full border p-2 rounded"
              />

              <label className="text-sm font-medium mt-2 block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full border p-2 rounded"
              />

              <p className="mt-3 text-lg font-semibold">
                Total: ${totalAmount.toFixed(2)}
              </p>

              <button
                onClick={handleCreateBooking}
                disabled={!token || createLoading}
                className={`mt-4 w-full py-2 px-4 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 transition ${
                  !token ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {createLoading
                  ? "Booking..."
                  : token
                  ? "Book Now"
                  : "Login to Book"}
              </button>
            </div>

            <div className="pt-6">
              <h4 className="font-semibold mb-2">Booked Dates</h4>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {renderCalendar()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetails;
