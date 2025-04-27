import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, setToken } = useContext(AppContext);

  const navigate = useNavigate();
  const signUp = async ({
    email,
    password,
    confirmPassword,
    name,
    phoneNumber,
  }) => {
    try {
      setLoading(true);

      const { data } = await axios.post(`${backendUrl}/api/auth/signup`, {
        email,
        password,
        confirmPassword,
        name,
        phoneNumber,
      });

      if (data.success) {
        setToken(data.token);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};

export default useSignUp;
