import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useDeleteBookings = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const deleteBooking = async ({ bookingId }) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        backendUrl + `/api/booking/delete-booking/${bookingId}`
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { deleteBooking, loading };
};

export default useDeleteBookings;
