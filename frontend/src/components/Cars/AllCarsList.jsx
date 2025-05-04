import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useGetAllCars from "../../hooks/useGetAllCars";
import {
  ArrowRightIcon,
  BoltIcon,
  CarIcon,
  CogIcon,
  HeartIcon,
  SparklesIcon,
} from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";
import Tilt from "react-parallax-tilt";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const AllCarsList = () => {
  const { getAllCars, loading } = useGetAllCars();
  const { allCars } = useContext(AppContext);
  const [activeFilter, setActiveFilter] = useState(null);
  const [displayedCars, setDisplayedCars] = useState(allCars);
  const navigate = useNavigate();
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
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-10 relative overflow-hidden">
      {/* Optional Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="50" r="2" fill="#cbd5e1" opacity="0.3">
            <animate
              attributeName="cy"
              values="0;100;0"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="80" cy="150" r="3" fill="#e0f2fe" opacity="0.4">
            <animate
              attributeName="cy"
              values="100;0;100"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full filter blur-[80px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-100 rounded-full filter blur-[100px] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10"
            >
              Discover Your{" "}
              <span className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-textShimmer">
                Dream Car
              </span>
            </motion.h2>
            <div className="absolute -top-4 -right-6 w-12 h-12 bg-yellow-100 rounded-full z-0"></div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mt-6 relative inline-block"
          >
            Browse our curated collection of premium vehicles
            <svg
              className="w-32 h-6 absolute -bottom-3 -right-8 text-blue-200"
              viewBox="0 0 130 20"
            >
              <path
                d="M0 10 C30 18, 80 2, 130 10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,3"
              />
            </svg>
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {["All", ...fuelTypes, "Latest"].map((filter) => (
              <motion.button
                key={filter}
                onClick={() => handleSort(filter.toLowerCase())}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-inner hover:shadow-md ${
                  activeFilter === filter.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {filter === "All" && <CarIcon className="w-4 h-4" />}
                {filter === "Electric" && (
                  <BoltIcon className="w-4 h-4 text-green-500" />
                )}
                {filter === "Gasoline" && (
                  <FuelPumpIcon className="w-4 h-4 text-orange-500" />
                )}
                {filter === "Diesel" && (
                  <CogIcon className="w-4 h-4 text-gray-500" />
                )}
                {filter === "Hybrid" && (
                  <FaBoltLightning className="w-4 h-4 text-blue-400" />
                )}
                {filter === "Latest" && (
                  <SparklesIcon className="w-4 h-4 text-yellow-400" />
                )}
                {filter}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {displayedCars.map((car, index) => (
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} key={index}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
           
                <CarCard car={car} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div className="flex justify-between items-start">
                    {/* <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button> */}
                    {car.discount && (
                      <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {car.discount}% OFF
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!car.available}
                    onClick={() => navigate("/car-details/" + car._id)}
                    className={`w-full py-3 rounded-lg font-medium transform translate-y-5 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 ${
                      car.available
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {car.available ? (
                      <>
                        View Details
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    ) : (
                      "Unavailable"
                    )}
                  </button>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </motion.div>

        <div className="mt-16 text-center relative">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default AllCarsList;
