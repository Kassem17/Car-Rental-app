import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const useCreateBooking = () => {
  const [createLoading, setCreateLoading] = useState(false);
  const { backendUrl, token, setBooking } = useContext(AppContext);
  const createBooking = async ({ carId, startDate, endDate, totalAmount }) => {
    setCreateLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + `/api/booking/create-booking/${carId}`,
        {
          startDate,
          endDate,
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setBooking(data.booking);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setCreateLoading(false);
    }
  };
  return { createBooking, createLoading };
};

export default useCreateBooking;
