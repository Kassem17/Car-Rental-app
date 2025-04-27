import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useDeleteCar = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(AppContext);

  const deleteCar = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + `/api/car/delete-car`,
        { carId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { deleteCar, loading };
};

export default useDeleteCar;
