import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const useAddCar = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(AppContext);

  const addCar = async (carData) => {
    try {
      setLoading(true);

      // Send the car data as a JSON object
      const { data } = await axios.post(
        `${backendUrl}/api/car/add-car`,
        carData, // Send the plain object with all form data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Specify JSON content type
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
      setLoading(false);
    }
  };

  return { addCar, loading };
};

export default useAddCar;

// const useAddCar = () => {
//   const [loading, setLoading] = useState(false);
//   const { backendUrl, token } = useContext(AppContext);

//   const addCar = async (formData) => {
//     try {
//       setLoading(true);

//       const { data } = await axios.post(
//         `${backendUrl}/api/car/add-car`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (data.success) {
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error.message ||
//           "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { addCar, loading };
// };

// export default useAddCar;
