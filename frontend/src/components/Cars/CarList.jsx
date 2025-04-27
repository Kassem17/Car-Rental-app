import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";
import useGetAllCars from "../../hooks/useGetAllCars";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  BoltIcon,
  CarIcon,
  CogIcon,
  HeartIcon,
  SparklesIcon,
} from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CarList = () => {
  const { getAllCars, loading } = useGetAllCars();
  const { allCars, userById } = useContext(AppContext);
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState(null);
  const [displayedCars, setDisplayedCars] = useState(allCars);
  // Get unique fuel types from allCars data
  const fuelTypes = [...new Set(allCars.map((car) => car.fuelType))];

  const handleSort = (type) => {
    // If clicking the already active filter, reset
    if (activeFilter === type) {
      setDisplayedCars(allCars);
      setActiveFilter(null);
      return;
    }

    let sortedCars = [...allCars];

    if (type === "latest") {
      sortedCars.sort((a, b) => b.year - a.year);
    } else if (fuelTypes.includes(type)) {
      sortedCars = sortedCars.filter((car) => car.fuelType === type);
    }

    setDisplayedCars(sortedCars);
    setActiveFilter(type);
  };

  useEffect(() => {
    setDisplayedCars(allCars);
  }, [allCars]);

  useEffect(() => {
    getAllCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div
      id="allCars"
      className="relative py-24 px-6 md:px-14 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-16 w-80 h-80 bg-pink-100 rounded-full blur-[120px] opacity-25 animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
          >
            Find Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mx-2 relative">
              Dream Car
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-300/40 rounded-full -z-10"></span>
            </span>
            Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Handpicked premium models for every style, drive, and adventure.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: "All Vehicles", icon: CarIcon, value: "all" },
            {
              label: "Electric",
              icon: BoltIcon,
              value: "Electric",
              color: "text-green-500",
            },
            {
              label: "Gasoline",
              icon: BsFillFuelPumpDieselFill,
              value: "Gasoline",
              color: "text-orange-500",
            },
            {
              label: "Diesel",
              icon: CogIcon,
              value: "Diesel",
              color: "text-gray-500",
            },
            {
              label: "Hybrid",
              icon: FaBoltLightning,
              value: "Hybrid",
              color: "text-blue-500",
            },
            {
              label: "Latest Models",
              icon: SparklesIcon,
              value: "latest",
              color: "text-yellow-500",
            },
          ].map(({ label, icon: Icon, value, color }) => (
            <button
              key={value}
              onClick={() => handleSort(value)}
              className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-md shadow-md transition-all ${
                activeFilter === value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${color || ""}`} />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Car Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {displayedCars.slice(0, 4).map((car, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              whileHover={{ scale: 1.03 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
            >
              <CarCard car={car} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-end">
                  <button className="bg-white/80 rounded-full p-2 hover:bg-white">
                    <HeartIcon className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/car-details/${car._id}`)}
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold shadow hover:shadow-lg flex justify-center items-center group-hover:translate-y-0 transform translate-y-5 transition-all duration-300"
                >
                  Quick View
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <div className="text-center mt-20">
          <motion.button
            onClick={() => navigate("/all-Cars")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transition-all group"
          >
            Explore Full Collection
            <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CarList;
