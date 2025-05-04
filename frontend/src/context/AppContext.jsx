import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  // for all Pages
  const [allCars, setAllCars] = useState([]);
  const [specificCar, setSpecificCar] = useState({});
  const [booking, setBooking] = useState({});
  const [userById, setUserById] = useState({});
  const [bookingForUser, setBookingForUser] = useState([]);
  const [bookingByCar, setBookingByCar] = useState([]);
  const [locations, setLocations] = useState([
    { id: 1, name: "Tyre", latitude: 33.27, longitude: 35.2033 },
    { id: 2, name: "Beirut", latitude: 33.8938, longitude: 35.5018 },
    { id: 3, name: "Baalbek", latitude: 34.0058, longitude: 36.211 },
    { id: 4, name: "Aley", latitude: 33.8106, longitude: 35.5972 },
  ]);

  // for admin Page
  const [users, setUsers] = useState([]);
  const [dashboardCars, setDashboardCars] = useState([]);
  const [dashboardBookings, setDashboardBookings] = useState([]);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/review/get-reviews"
        );
        if (data.success) {
          setReviews(data.reviews);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchReviews();
  }, []);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [unavailableCar, setUnavailableCar] = useState([]);

  useEffect(() => {
    const fetchUnavailableCarIds = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/booking/unavailable"
        );
        if (data.success) {
          setUnavailableCar(data.unavailableCarIds);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
    fetchUnavailableCarIds();
  }, []);

  const value = {
    token,
    setToken,
    backendUrl,
    allCars,
    setAllCars,
    specificCar,
    setSpecificCar,
    booking,
    setBooking,
    userById,
    setUserById,
    bookingForUser,
    setBookingForUser,
    bookingByCar,
    setBookingByCar,
    users,
    setUsers,
    dashboardCars,
    setDashboardCars,
    dashboardBookings,
    setDashboardBookings,
    reviews,
    setReviews,
    locations,
    setLocations,
    unavailableCar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
