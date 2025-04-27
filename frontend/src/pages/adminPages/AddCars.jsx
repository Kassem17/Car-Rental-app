import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  ExclamationCircleIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { GiCarKey as CarIcon, GiCarWheel as WheelIcon } from "react-icons/gi";
import { FiSettings as CogIcon } from "react-icons/fi";
import { BsCalendar3 as CalendarIcon } from "react-icons/bs";
import { HiOutlineCurrencyDollar as CurrencyDollarIcon } from "react-icons/hi";
import { IoFlashOutline as LightningBoltIcon } from "react-icons/io5";
import { HiOutlineUserGroup as UserGroupIcon } from "react-icons/hi";
import { HiOutlineUser as UserIcon } from "react-icons/hi";
import { HiOutlineTruck as TruckIcon } from "react-icons/hi";
import { HiOutlineDocumentText as DocumentTextIcon } from "react-icons/hi";
import { HiOutlineCamera as CameraIcon } from "react-icons/hi";
import { HiOutlinePhotograph as PhotoIcon } from "react-icons/hi";
import useAddCar from "../../hooks/useAddCar.js";
import { Widget } from "@uploadcare/react-widget";

const AddCars = () => {
  const { addCar, loading } = useAddCar();
  const [error, setError] = useState(null);
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [description, setDescription] = useState("");
  const [seats, setSeats] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [carImageUrl, setCarImageUrl] = useState(null);

  const handleImageUpload = (url) => {
    setCarImageUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const carData = {
      brand,
      model,
      year,
      pricePerDay,
      description,
      seats,
      fuelType,
      carImageUrl,
    };

    try {
      await addCar(carData);
      setModel("");
      setBrand("");
      setYear("");
      setPricePerDay("");
      setDescription("");
      setSeats("");
      setFuelType("");
      setCarImageUrl(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Decorative elements */}
      <div className="absolute -right-32 -top-32 opacity-10">
        <WheelIcon className="w-64 h-64 text-cyan-400 rotate-45" />
      </div>

      <div className="absolute -left-20 -bottom-20 opacity-10">
        <WheelIcon className="w-64 h-64 text-emerald-400 -rotate-45" />
      </div>

      {/* Header */}
      <div className="relative mb-8 text-center">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Add New Vehicle
        </motion.h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Complete the form to list your car in our premium fleet
        </p>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-sm text-gray-400 bg-gray-900 rounded-full flex items-center">
              <CarIcon className="w-5 h-5 mr-2 text-cyan-400" />
              Vehicle Specifications
            </span>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          className="p-4 mb-6 text-red-100 bg-red-900/50 rounded-lg border border-red-700/50 text-center backdrop-blur-sm"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <ExclamationCircleIcon className="inline w-5 h-5 mr-2 text-red-300" />
          <span className="font-medium">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid layout for first set of fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Brand */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors h-full">
              <div className="flex items-center mb-2">
                <CarIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Brand
                </label>
              </div>
              <input
                type="text"
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-medium border-b border-gray-700 focus:border-cyan-400 pb-2"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Tesla, BMW, Toyota..."
              />
            </div>
          </motion.div>

          {/* Model */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors h-full">
              <div className="flex items-center mb-2">
                <CogIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Model
                </label>
              </div>
              <input
                type="text"
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-medium border-b border-gray-700 focus:border-cyan-400 pb-2"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Model 3, X5, Camry..."
              />
            </div>
          </motion.div>

          {/* Year */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors h-full">
              <div className="flex items-center mb-2">
                <CalendarIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Year
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-medium border-b border-gray-700 focus:border-cyan-400 pb-2"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2023"
                />
                {year && (
                  <div className="absolute right-0 bottom-2 text-xs font-medium text-emerald-400 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Valid
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Price */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors h-full">
              <div className="flex items-center mb-2">
                <CurrencyDollarIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Price per Day
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-0 bottom-2 text-white text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-medium border-b border-gray-700 focus:border-cyan-400 pb-2 pl-6"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  placeholder="99"
                />
                {pricePerDay && (
                  <div className="absolute right-0 bottom-2 text-xs font-medium text-amber-400">
                    {pricePerDay < 50
                      ? "Great deal!"
                      : pricePerDay < 100
                      ? "Competitive"
                      : "Premium"}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Second row */}
        <div className="space-y-5">
          {/* Fuel Type */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center mb-2">
                <LightningBoltIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Fuel Type
                </label>
              </div>
              <div className="relative">
                <select
                  className="w-full bg-gray-900/30 text-white focus:outline-none border-b border-gray-700 focus:border-cyan-400 appearance-none text-lg font-medium pb-2 pr-8"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                >
                  <option value="" className="bg-gray-800">
                    Select fuel type
                  </option>
                  <option value="Petrol" className="bg-gray-800">
                    ⛽ Petrol
                  </option>
                  <option value="Diesel" className="bg-gray-800">
                    🛢️ Diesel
                  </option>
                  <option value="Electric" className="bg-gray-800">
                    🔋 Electric
                  </option>
                  <option value="Hybrid" className="bg-gray-800">
                    ⚡ Hybrid
                  </option>
                </select>
                <ChevronDownIcon className="absolute right-0 bottom-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Seats */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center mb-2">
                <UserGroupIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Seats
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-medium border-b border-gray-700 focus:border-cyan-400 pb-2"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  placeholder="5"
                />
                {seats && (
                  <div className="absolute right-0 bottom-2 text-xs font-medium text-purple-400 flex items-center">
                    {seats > 6 ? (
                      <>
                        <TruckIcon className="w-4 h-4 mr-1" />
                        Large vehicle
                      </>
                    ) : (
                      <>
                        <UserIcon className="w-4 h-4 mr-1" />
                        Compact
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center mb-2">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Description
                </label>
              </div>
              <textarea
                className="w-full bg-gray-900/30 text-white placeholder-gray-500 focus:outline-none border border-gray-700 focus:border-cyan-400 rounded-lg transition min-h-[120px] text-lg font-medium p-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the car's features, condition, and special attributes..."
              />
              <div className="text-xs text-right text-gray-500 mt-1">
                <span
                  className={
                    description.length > 450
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }
                >
                  {description.length}
                </span>
                /500 characters
              </div>
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center mb-2">
                <CameraIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <label className="text-sm font-medium text-gray-300">
                  Car Image
                </label>
              </div>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center transition hover:border-cyan-400">
                {carImageUrl ? (
                  <motion.div
                    className="flex items-center justify-center space-x-4"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="relative">
                      <PhotoIcon className="h-12 w-12 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Image uploaded</p>
                      <p className="text-xs text-gray-400">Ready to submit</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCarImageUrl(null)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-900/20 transition"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.label
                    htmlFor="carImageUrl"
                    className="cursor-pointer flex flex-col items-center"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="mb-3">
                      <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 group-hover:text-cyan-400 transition mx-auto" />
                    </div>
                    <p className="text-white font-medium group-hover:text-cyan-300 transition">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                    <Widget
                      publicKey="7daf2c8b2552e057e89c"
                      onChange={(fileInfo) =>
                        handleImageUpload(fileInfo.cdnUrl)
                      }
                      className="hidden"
                    />
                  </motion.label>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          className="pt-4"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            type="submit"
            className={`w-full py-4 px-6 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg transition-all duration-300 relative overflow-hidden ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Add Vehicle to Fleet
                </>
              )}
            </span>
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddCars;
