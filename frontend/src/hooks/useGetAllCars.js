import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useGetAllCars = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, setAllCars } = useContext(AppContext);

  const getAllCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/car/get-cars`);

      if (data.success) {
        setAllCars(data.cars);
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

  return { getAllCars, loading };
};

export default useGetAllCars;
