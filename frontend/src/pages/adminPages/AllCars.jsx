import React, { use, useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { UsersIcon } from "@heroicons/react/24/outline";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import useDeleteCar from "./hooks/useDeleteCar";
import useChangeStatus from "./hooks/useChangeStatus";
import { useNavigate } from "react-router-dom";
import useUpdateCar from "./hooks/useUpdateCar";

const AllCars = () => {
  const { dashboardCars } = useContext(AppContext);
  const { deleteCar, loading } = useDeleteCar();
  const { changeStatus } = useChangeStatus();
  const navigate = useNavigate();
  const { updateCar } = useUpdateCar();
  const [pricePerDay, setPricePerDay] = useState("");
  const [edit, setEdit] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null); // Track which car is being edited

  const handleDeleteCar = (id) => {
    window.confirm("Are you sure you want to delete this car?") &&
      deleteCar(id);
  };

  const handleChangeStatus = (id) => {
    window.confirm("Are you sure you want to delete this car?") &&
      changeStatus(id);
  };

  const handleUpdate = async (id) => {
    await updateCar(id, pricePerDay);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">Cars</span> Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect vehicle for your next adventure
          </p>
        </motion.div>
        {/* Cars Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Year
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fuel Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Seats
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price/Day
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardCars.map((car) => (
                  <motion.tr
                    key={car._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            className="h-12 w-16 rounded-md object-cover"
                            src={car.carImage || "/default-car.jpg"}
                            alt="cars"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {car.brand} {car.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {car.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <BsFillFuelPumpDieselFill className="w-4 h-4 mr-1 text-blue-500" />
                        {car.fuelType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-1 text-blue-500" />
                        {car.seats}
                      </div>
                    </td>

                    {edit && editingCarId === car._id ? (
                      <td>
                        <input
                          type="number"
                          value={pricePerDay}
                          placeholder="Enter price per day"
                          onChange={(e) => setPricePerDay(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1"
                        />
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        ${car.pricePerDay}
                      </td>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {edit && editingCarId === car._id ? (
                          <button
                            onClick={() => handleUpdate(car._id)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEdit(true);
                              setEditingCarId(car._id);
                              setPricePerDay(car.pricePerDay); // Set initial price for editing
                            }}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Update
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleChangeStatus(car._id)}
                          className={`text-white px-3 py-1 rounded-md transition-colors ${
                            car.available
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {car.available ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all"
        onClick={() => navigate("/add-cars")}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </motion.button>
    </div>
  );
};

export default AllCars;
