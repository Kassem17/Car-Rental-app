import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const useCancelBookingById = () => {
  const [cancelLoading, setCancelLoading] = useState(false);
  const { backendUrl, token } = useContext(AppContext);

  const cancelBooking = async ({ bookingId }) => {
    try {
      setCancelLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/booking/cancel-booking/${bookingId}`,
        {},
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
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  return { cancelBooking, cancelLoading };
};

export default useCancelBookingById;
