import  { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const useGetUserById = () => {
  const { backendUrl, token, setUserById } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const getUserById = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserById(data.user);
      } else {
        toast.error(data.message || "Failed to get user");
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

  return { getUserById, loading };
};

export default useGetUserById;
