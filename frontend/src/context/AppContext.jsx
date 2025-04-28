import { createContext, useEffect, useState } from "react";
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

  // for admin Page
  const [users, setUsers] = useState([]);
  const [dashboardCars, setDashboardCars] = useState([]);
  const [dashboardBookings, setDashboardBookings] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
