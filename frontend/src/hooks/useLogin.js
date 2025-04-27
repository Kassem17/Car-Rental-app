import  { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
