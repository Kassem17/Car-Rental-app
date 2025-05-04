import  { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useGetCarBooking = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, setBookingByCar } = useContext(AppContext);

  const getBookingByCarId = async (carId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/booking/get-booking-by-car/${carId}`
      );
      if (data.success) {
        setBookingByCar(data.carBooking);
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
      setLoading(false);
    }
  };
  return { getBookingByCarId, loading };
};

export default useGetCarBooking;
