import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import useAddCar from "../../hooks/useAddCar";
import { Widget } from "@uploadcare/react-widget";
import { toast } from "react-toastify";

const AddCars = () => {
  const { addCar, loading } = useAddCar();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    model: "",
    brand: "",
    year: "",
    pricePerDay: "",
    description: "",
    seats: "",
    fuelType: "",
    carImageUrl: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, carImageUrl: url }));
    toast.success("Image uploaded successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await addCar(formData);
      toast.success("Car added successfully!");
      // Reset form
      setFormData({
        model: "",
        brand: "",
        year: "",
        pricePerDay: "",
        description: "",
        seats: "",
        fuelType: "",
        carImageUrl: null,
      });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Add New Vehicle
                </motion.h1>
                <p className="text-blue-100 mt-2">
                  Complete the form to list your car in our premium fleet
                </p>
              </div>
              <div className="hidden sm:block">
                <CarIcon className="w-12 h-12 text-white opacity-20" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{error}</h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <CarIcon className="h-5 w-5" />
                  </span>
                  Vehicle Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Brand */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Brand
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="brand"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Tesla, BMW, Toyota..."
                        required
                      />
                    </div>
                  </div>

                  {/* Model */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="model"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="Model 3, X5, Camry..."
                        required
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="year"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="2023"
                        required
                      />
                      {formData.year && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Price per Day
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="pricePerDay"
                        min="1"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 pl-7 border"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder="99"
                        required
                      />
                      {formData.pricePerDay && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sm text-gray-500">
                          {formData.pricePerDay < 50
                            ? "Great deal!"
                            : formData.pricePerDay < 100
                            ? "Competitive"
                            : "Premium"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <CogIcon className="h-5 w-5" />
                  </span>
                  Specifications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Fuel Type */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Fuel Type
                    </label>
                    <div className="relative">
                      <select
                        name="fuelType"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border appearance-none bg-white"
                        value={formData.fuelType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select fuel type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Seats
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="seats"
                        min="1"
                        max="12"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                        value={formData.seats}
                        onChange={handleChange}
                        placeholder="5"
                        required
                      />
                      {formData.seats && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {formData.seats > 6 ? (
                            <TruckIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <DocumentTextIcon className="h-5 w-5" />
                  </span>
                  Description
                </h2>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the car's features, condition, and special attributes..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <CameraIcon className="h-5 w-5" />
                  </span>
                  Vehicle Images
                </h2>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Main Image
                  </label>
                  {formData.carImageUrl ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <PhotoIcon className="h-10 w-10 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Image uploaded
                          </p>
                          <p className="text-sm text-gray-500">
                            Ready to submit
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            carImageUrl: null,
                          }))
                        }
                        className="text-red-500 hover:text-red-700 p-1 rounded-full"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex justify-center">
                          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <Widget
                              publicKey="7daf2c8b2552e057e89c"
                              onChange={(fileInfo) =>
                                handleImageUpload(fileInfo.cdnUrl)
                              }
                              className="hidden"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
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
                      <PlusCircleIcon className="h-5 w-5 mr-2" />
                      Add Vehicle to Fleet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddCars;
