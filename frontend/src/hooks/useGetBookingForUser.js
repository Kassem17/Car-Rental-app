import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useGetBookingForUser = () => {
  const [loading, setLoading] = useState(false);

  const { backendUrl, setBookingForUser, token } = useContext(AppContext);

  const getBookingByUser = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(backendUrl + "/api/booking/get-booking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setBookingForUser(data.bookings);
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
  return { getBookingByUser, loading };
};

export default useGetBookingForUser;
