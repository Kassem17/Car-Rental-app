import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { token, backendUrl } = useContext(AppContext);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-profile`,
        profileData,
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
      console.error("Error updating profile:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};

export default useUpdateProfile;
