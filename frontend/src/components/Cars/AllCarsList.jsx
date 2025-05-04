import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useGetAllCars from "../../hooks/useGetAllCars";
import {
  ArrowRightIcon,
  SparklesIcon, // For "All" filter
  BoltIcon, // For electric
  FlameIcon, // For gas/petrol (using Flame as substitute for Fuel)
  CarIcon, // General car icon
  GaugeIcon, // Using as substitute for Diesel
} from "lucide-react";
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayedCars, setDisplayedCars] = useState(allCars);
  const navigate = useNavigate();

  // Get unique fuel types and add 'all' and 'latest' options
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const filterOptions = ["all", ...fuelTypes];

  // Icon mapping for each filter type
  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case "all":
        return <SparklesIcon className="w-4 h-4" />;
      case "Electric":
        return <BoltIcon className="w-4 h-4" />;
      case "Petrol":
        return <FlameIcon className="w-4 h-4" />;
      case "Diesel":
        return <GaugeIcon className="w-4 h-4" />;
      case "Hybrid":
        return <CarIcon className="w-4 h-4" />;
      default:
        return <CarIcon className="w-4 h-4" />;
    }
  };

  const handleSort = (type) => {
    setActiveFilter(type);

    if (type === "all") {
      setDisplayedCars(allCars);
      return;
    }

 

    // Filter by fuel type
    const filteredCars = allCars.filter((car) => car.fuelType === type);
    setDisplayedCars(filteredCars);
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
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 relative">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-textShimmer">
              Dream Car
            </span>
          </motion.h2>

          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            Browse our curated collection of premium vehicles
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filterOptions.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => handleSort(filter)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getFilterIcon(filter)}
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {displayedCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">
              {activeFilter === "all"
                ? "No cars available at the moment."
                : `No ${activeFilter} cars found.`}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => handleSort("all")}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <SparklesIcon className="w-4 h-4" />
                Show All Cars
              </button>
            )}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {displayedCars.map((car) => (
              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} key={car._id}>
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
                    {car.discount && (
                      <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        {car.discount}% OFF
                      </div>
                    )}

                    <button
                      disabled={!car.available}
                      onClick={() => navigate(`/car-details/${car._id}`)}
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
        )}
      </div>
    </div>
  );
};

export default AllCarsList;
