import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const useChangeStatus = () => {
  const { backendUrl, token } = useContext(AppContext);
  const changeStatus = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/car/change-status",
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
      toast.error(error.message);
    }
  };

  return { changeStatus };
};

export default useChangeStatus;
