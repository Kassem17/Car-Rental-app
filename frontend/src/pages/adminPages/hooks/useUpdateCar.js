import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const useUpdateCar = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const updateCar = async (id, pricePerDay) => {
    try {
      setUpdateLoading(true);
      const { data } = await axios.put(
        `${backendUrl}/api/car/update-car/${id}`,
        { pricePerDay } // <-- wrap it in an object here
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating car:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateCar, updateLoading };
};

export default useUpdateCar;
