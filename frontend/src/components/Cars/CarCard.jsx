import React from "react";
import { motion } from "framer-motion";
import { FuelIcon, GaugeIcon, HeartIcon, StarIcon, UsersIcon } from "lucide-react";

const CarCard = ({ car }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-labelledby={`car-${car.id}-title`}
    >
      {/* Image with gradient overlay and favorite button */}
      <div className="relative">
        <motion.img
          src={car.carImage}
          alt={`${car.brand} ${car.model}`}
          className="h-56 w-full object-cover group-hover:brightness-90 transition-all duration-500"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all"
          aria-label="Add to favorites"
        >
          <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>

        {/* Availability badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            car.available
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {car.available ? "AVAILABLE" : "BOOKED"}
        </div>
      </div>

      {/* Car Information */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3
            id={`car-${car.id}-title`}
            className="text-xl font-bold text-gray-900 truncate max-w-[70%]"
          >
            {car.brand} {car.model}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {car.year}
          </span>
        </div>

        {/* Features with icons */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex items-center text-sm text-gray-600">
            <FuelIcon className="w-4 h-4 mr-1 text-blue-500" />
            {car.fuelType}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <UsersIcon className="w-4 h-4 mr-1 text-blue-500" />
            {car.seats} seats
          </div>
          {/* <div className="flex items-center text-sm text-gray-600">
            <GaugeIcon className="w-4 h-4 mr-1 text-blue-500" />
            {car.mileage} kmpl
          </div> */}
        </div>

        {/* Rating and reviews */}
        {/* <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < car.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({car.reviews} reviews)
          </span>
        </div> */}

        {/* Description with read more */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 relative">
          {car.description}
          <button className="absolute bottom-0 right-0 bg-white pl-2 text-blue-600 hover:underline text-xs">
            Read more
          </button>
        </p>

        {/* Price and action button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-blue-600 font-bold text-xl">
              ${car.pricePerDay}
              <span className="text-sm font-normal">/day</span>
            </p>
          </div>

          {/* <motion.button
            className={`px-5 py-2 rounded-lg font-medium text-white ${
              car.available
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            whileHover={car.available ? { scale: 1.05 } : {}}
            whileTap={car.available ? { scale: 0.95 } : {}}
            disabled={!car.available}
          >
            {car.available ? "Rent Now" : "Unavailable"}
          </motion.button> */}
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
