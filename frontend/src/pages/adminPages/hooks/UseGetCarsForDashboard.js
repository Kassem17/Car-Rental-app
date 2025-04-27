import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UseGetCarsForDashboard = () => {
  const [carLoading, setCarLoading] = useState(false);

  const { backendUrl, setDashboardCars } = useContext(AppContext);

  const getCarsForDashboard = async () => {
    try {
      setCarLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/car/get-cars`);

      if (data.success) {
        setDashboardCars(data.cars);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setCarLoading(false);
    }
  };

  return { getCarsForDashboard, carLoading };
};

export default UseGetCarsForDashboard;
