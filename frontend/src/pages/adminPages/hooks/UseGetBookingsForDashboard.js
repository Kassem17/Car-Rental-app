import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const UseGetBookingsForDashboard = () => {
  const [bookingLoading, setBookingLoading] = useState(false);
  const { setDashboardBookings, token, backendUrl } = useContext(AppContext);

  const getBookings = async () => {
    try {
      setBookingLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/get-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setDashboardBookings(data.bookings);
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
      setBookingLoading(false);
    }
  };

  return { getBookings, bookingLoading };
};

export default UseGetBookingsForDashboard;
