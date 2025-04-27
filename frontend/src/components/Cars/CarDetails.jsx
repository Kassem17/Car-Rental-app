import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Fuel,
  Heart,
  Star,
  Info,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useGetSpecificCar from "../../hooks/useGetSpecificCar";
import useCreateBooking from "../../hooks/useCreateBooking";
import useCancelBooking from "../../hooks/useCancelBooking";
import useGetBookingForUser from "../../hooks/useGetBookingForUser";
import useGetUserById from "../../hooks/useGetUserById";
import useGetCarBooking from "../../hooks/useGetCarBooking";

const CarDetails = () => {
  const { specificCar, userById, bookingForUser, token, bookingByCar } =
    useContext(AppContext);
  const { getSpecificCar, loading } = useGetSpecificCar();
  const { carId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const { createBooking, createLoading } = useCreateBooking();
  const { cancelBooking, cancelLoading } = useCancelBooking();
  const { getBookingByUser } = useGetBookingForUser();
  const { getUserById } = useGetUserById();
  const { getBookingByCarId } = useGetCarBooking();

  useEffect(() => {
    if (token) {
      getBookingByUser();
      getUserById();
    }
  }, []);

  useEffect(() => {
    if (carId) {
      getBookingByCarId(carId);
    }
  }, [carId]);

  useEffect(() => {
    if (startDate && endDate && specificCar?.pricePerDay) {
      const days =
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24);

      if (days > 0) {
        setTotalAmount(days * specificCar.pricePerDay);
      }
    }
  }, [startDate, endDate, specificCar]);

  useEffect(() => {
    getSpecificCar(carId);
  }, [carId]);

  const handleCreateBooking = async (e, id) => {
    e.preventDefault();
    await createBooking({ carId: id, startDate, endDate, totalAmount });
  };

  // const handleCancelBooking = async (id) => {
  //   await cancelBooking({ carId: id });
  // };

  const userBookingForThisCar = bookingForUser?.find(
    (booking) =>
      (booking.car === specificCar._id ||
        booking.car?._id === specificCar._id) &&
      booking.user === userById._id &&
      booking.status !== "cancelled"
  );

  const hasUserBookedThisCar = !!userBookingForThisCar;
  const isBookedByAnotherUser = !specificCar.available && !hasUserBookedThisCar;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section with Image Gallery */}
        <div className="relative h-96 lg:h-[500px] bg-gradient-to-r from-gray-50 to-gray-100">
          {/* Main Image with Zoom Effect */}
          <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-12 overflow-hidden">
            <motion.img
              src={specificCar.carImage}
              alt={`${specificCar.brand} ${specificCar.model}`}
              className="h-full w-auto max-w-full object-contain transition-transform duration-300 hover:scale-105"
              whileHover={{ scale: 1.03 }}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-6 left-6 flex gap-3">
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md backdrop-blur-sm ${
                specificCar.available
                  ? "bg-green-100/90 text-green-800"
                  : "bg-red-100/90 text-red-800"
              }`}
            >
              {specificCar.available ? "Available Now" : "Currently Booked"}
            </div>
            {specificCar.featured && (
              <div className="px-4 py-2 rounded-full bg-yellow-100/90 text-yellow-800 text-sm font-medium shadow-md backdrop-blur-sm">
                Featured
              </div>
            )}
          </div>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-6 right-6 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition hover:scale-110"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={24}
              className={
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }
            />
          </button>

          {/* Image Gallery Indicator (if multiple images exist) */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-3 h-3 rounded-full ${
                  dot === 1 ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Car Details */}
          <div className="p-8 lg:p-12">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {specificCar.brand} {specificCar.model}
                </h1>
                <span className="text-xl text-blue-600 font-medium">
                  {specificCar.year}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(24 reviews)</span>
              </div>
            </div>

            {/* Price with Discount Badge */}
            <div className="mb-8 relative">
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-blue-600">
                  ${specificCar.pricePerDay}
                  <span className="text-lg font-normal text-gray-500">
                    /day
                  </span>
                </p>
                {specificCar.originalPrice && (
                  <p className="text-lg text-gray-400 line-through">
                    ${specificCar.originalPrice}
                  </p>
                )}
              </div>
              {specificCar.originalPrice && (
                <div className="absolute -top-3 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Save ${specificCar.originalPrice - specificCar.pricePerDay}
                </div>
              )}
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <Fuel size={20} />,
                  label: "Fuel",
                  value: specificCar.fuelType,
                },
                {
                  icon: <Users size={20} />,
                  label: "Seats",
                  value: specificCar.seats,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{feature.label}</p>
                    <p className="font-medium">{feature.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full border-b-2 border-indigo-300 my-4"></div>

            {/* Description with Read More */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info size={20} className="text-blue-500" />
                About This Vehicle
              </h3>
              <div className="relative">
                <p
                  className={`text-gray-600 leading-relaxed ${
                    !expandedDescription ? "line-clamp-3" : ""
                  }`}
                >
                  {specificCar.description}
                </p>
                <button
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                >
                  {expandedDescription ? "Show less" : "Read more"}
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "GPS Navigation",
                "Bluetooth",
                "Air Conditioning",
                "Automatic",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="p-8 lg:p-12 bg-gray-50">
            <div className="sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Book Your Adventure
              </h3>

              {/* Date Pickers with Visual Calendar */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <input
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      type="date"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium"
                      min={new Date().toISOString().split("T")[0]}
                      onFocus={(e) => e.target.showPicker()}
                    />
                    <Calendar className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Return Date
                  </label>
                  <div className="relative">
                    <input
                      value={endDate}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={(e) => e.target.showPicker()}
                      type="date"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium"
                    />
                    <Calendar className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {/* <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Price Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${specificCar.pricePerDay} x 3 days
                    </span>
                    <span className="font-medium">
                      ${specificCar.pricePerDay * 3}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">$15.00</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${specificCar.pricePerDay * 3 + 15}</span>
                  </div>
                </div>
              </div> */}

              {/* Booking Status */}
              <div className="mb-6">
                {isBookedByAnotherUser ? (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 font-medium">
                    This car is already booked for your selected dates.
                  </div>
                ) : hasUserBookedThisCar && !isBookedByAnotherUser ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700 font-medium">
                      You have a booking for this vehicle!
                    </div>
                    {/* <button
                      onClick={() => handleCancelBooking(specificCar._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {cancelLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <X size={18} />
                          Cancel Booking
                        </>
                      )}
                    </button> */}
                  </div>
                ) : (
                  <button
                    disabled={
                      createLoading ||
                      !token ||
                      !userById ||
                      userById.role !== "customer"
                    }
                    onClick={(e) => handleCreateBooking(e, specificCar._id)}
                    className={`
                    w-full 
                    bg-gradient-to-r from-blue-600 to-blue-500 
                    hover:from-blue-700 hover:to-blue-600 
                    ${
                      createLoading ||
                      !token ||
                      !userById ||
                      userById.role !== "customer"
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-xl"
                    }
                    text-white py-4 px-6 rounded-lg font-bold shadow-lg 
                    transition-all flex items-center justify-center gap-2
                  `}
                  >
                    {createLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        {!token
                          ? "Login to Reserve"
                          : !userById
                          ? "Loading..."
                          : userById.role !== "customer"
                          ? "Customers Only"
                          : "Reserve Now"}
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Booking Calendar Preview */}
              {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-700 mb-3">
                  Availability Calendar
                </h4>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <div
                        key={`day-header-${index}`}
                        className="text-xs text-gray-500 font-medium"
                      >
                        {day[0]}
                      </div>
                    )
                  )}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i - date.getDay());
                    const isBooked = bookingByCar.some((booking) => {
                      const bookingStart = new Date(booking.startDate);
                      const bookingEnd = new Date(booking.endDate);
                      return date >= bookingStart && date <= bookingEnd;
                    });

                    return (
                      <div
                        key={`date-${i}`}
                        className={`p-1 text-sm ${
                          isBooked
                            ? "bg-red-100 text-red-800 rounded"
                            : date < new Date()
                            ? "text-gray-400"
                            : "text-gray-700 hover:bg-blue-50 cursor-pointer"
                        }`}
                        onClick={() => !isBooked && handleDateSelect(date)}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div> */}

              {/* Existing Bookings */}
              {bookingByCar.filter((b) => b.status === "pending").length >
                0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Current Bookings
                  </h4>
                  <div className="space-y-3">
                    {bookingByCar.map((booking) => {
                      if (booking.status === "pending") {
                        return (
                          <div
                            key={booking._id}
                            className="bg-blue-50/50 border border-blue-200 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-blue-800">
                                  {new Date(
                                    booking.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    booking.endDate
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-blue-600">
                                  Booking ID:{" "}
                                  {booking._id.slice(-6).toUpperCase()}
                                </p>
                              </div>
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                Pending
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetails;
