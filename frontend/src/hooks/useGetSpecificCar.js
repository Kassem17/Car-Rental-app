import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useGetSpecificCar = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, setSpecificCar } = useContext(AppContext);

  const getSpecificCar = async (carId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        backendUrl + `/api/car/get-specific-car/` + carId
      );
      if (data.success) {
        setSpecificCar(data.car);
        // Optional: show success message
        // toast.success("Cars loaded successfully!");
      } else {
        toast.error(data.message || "Failed to load cars");
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return { getSpecificCar, loading };
};

export default useGetSpecificCar;
