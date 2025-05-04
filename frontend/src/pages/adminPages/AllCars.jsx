import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FiCheck, FiX } from "react-icons/fi";
import useDeleteCar from "./hooks/useDeleteCar";
import useChangeStatus from "./hooks/useChangeStatus";
import { useNavigate } from "react-router-dom";
import useUpdateCar from "./hooks/useUpdateCar";
import { toast } from "react-toastify";

const AllCars = () => {
  const { dashboardCars } = useContext(AppContext);
  const { deleteCar, loading: deleteLoading } = useDeleteCar();
  const { changeStatus, loading: statusLoading } = useChangeStatus();
  const navigate = useNavigate();
  const { updateCar, loading: updateLoading } = useUpdateCar();
  const [pricePerDay, setPricePerDay] = useState("");
  const [editingCarId, setEditingCarId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCars = dashboardCars.filter(
    (car) =>
      `${car.brand} ${car.model}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      car.year.toString().includes(searchTerm) ||
      car.fuelType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCar = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      await deleteCar(id);
      toast.success("Car deleted successfully");
    }
  };

  const handleChangeStatus = async (id) => {
    await changeStatus(id);
    toast.success("Car status updated");
  };

  const handleUpdate = async (id) => {
    if (!pricePerDay) {
      toast.error("Please enter a valid price");
      return;
    }
    await updateCar(id, pricePerDay);
    setEditingCarId(null);
    toast.success("Price updated successfully");
  };

  const cancelEdit = () => {
    setEditingCarId(null);
    setPricePerDay("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-blue-600">Car</span> Inventory
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your fleet of {dashboardCars.length} vehicles
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search cars..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => navigate("/add-cars")}
                className="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="text-nowrap">Add Car</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Cars Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Day
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredCars.map((car) => (
                    <motion.tr
                      key={car._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-20 rounded-lg overflow-hidden">
                            <img
                              className="h-full w-full object-cover"
                              src={car.carImage || "/default-car.jpg"}
                              alt={`${car.brand} ${car.model}`}
                              onError={(e) => {
                                e.target.src = "/default-car.jpg";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-xs text-gray-500">
                              {car.plateNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {car.year}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <BsFillFuelPumpFill className="w-4 h-4 mr-2 text-blue-500" />
                          {car.fuelType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <UsersIcon className="w-4 h-4 mr-2 text-blue-500" />
                          {car.seats}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingCarId === car._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={pricePerDay}
                              placeholder="Price"
                              onChange={(e) => setPricePerDay(e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-blue-600">
                            ${car.pricePerDay}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {editingCarId === car._id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(car._id)}
                                disabled={updateLoading}
                                className="p-1.5 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCarId(car._id);
                                  setPricePerDay(car.pricePerDay);
                                }}
                                className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                title="Edit price"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCar(car._id)}
                                disabled={deleteLoading}
                                className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                title="Delete car"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleChangeStatus(car._id)}
                                disabled={statusLoading}
                                className={`p-1.5 rounded-md transition-colors ${
                                  car.available
                                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                                    : "text-green-600 bg-green-50 hover:bg-green-100"
                                }`}
                                title={
                                  car.available ? "Disable car" : "Enable car"
                                }
                              >
                                <ArrowPathIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No cars found</div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AllCars;
