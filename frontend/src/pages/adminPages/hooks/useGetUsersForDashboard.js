import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useGetUsersForDashboard = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, token, setUsers } = useContext(AppContext);

  const getUsersForDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/admin/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { getUsersForDashboard, loading };
};

export default useGetUsersForDashboard;
