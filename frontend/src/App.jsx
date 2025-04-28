import React, { use, useContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./context/AppContext";
import Footer from "./components/Footer";
import AddCars from "./pages/adminPages/AddCars";
import { motion } from "framer-motion";
import AllCarsList from "./components/Cars/AllCarsList";
import CarDetails from "./components/Cars/CarDetails";
import MyBookings from "./pages/userPage/MyBookings";
import useGetUserById from "./hooks/useGetUserById";
import Dashboard from "./pages/adminPages/Dashboard";
import useGetUsersForDashboard from "./pages/adminPages/hooks/useGetUsersForDashboard";
import UseGetCarsForDashboard from "./pages/adminPages/hooks/UseGetCarsForDashboard";
import UseGetBookingsForDashboard from "./pages/adminPages/hooks/UseGetBookingsForDashboard";
import AllUsers from "./pages/adminPages/AllUsers";
import AllCars from "./pages/adminPages/AllCars";
import Profile from "./components/Profile";
import Voucher from "./components/Voucher";

const App = () => {
  const { token, userById } = useContext(AppContext);
  const location = useLocation();
  const { getUserById } = useGetUserById();
  const { getUsersForDashboard } = useGetUsersForDashboard();
  const { getCarsForDashboard } = UseGetCarsForDashboard();
  const { getBookings } = UseGetBookingsForDashboard();

  useEffect(() => {
    if (token) {
      getUserById();
      getUsersForDashboard();
      getCarsForDashboard();
      getBookings();
    }
  }, []);

  // Protected Route Wrapper (only used for /add-cars)
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Animated Navbar with subtle shadow */}
      <header className="shrink-0 sticky top-0 z-50">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Navbar className="bg-white/90 text-black backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300" />
      </header>

      {/* Main content with subtle animation on load */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 transition-all duration-500 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <Routes>
            {/* Home - Always accessible */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Home />
                </motion.div>
              }
            />

            {/* Login - Redirect to home if already logged in */}
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to="/" replace />
                ) : (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <Login className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md hover:shadow-xl transition-shadow" />
                  </div>
                )
              }
            />

            {/* Signup - Redirect to home if already logged in */}
            <Route
              path="/signup"
              element={
                token ? (
                  <Navigate to="/" replace />
                ) : (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <SignUp className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md hover:shadow-xl transition-shadow" />
                  </div>
                )
              }
            />

            {/* Only protect the add-cars route */}
            <Route
              path="/add-cars"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AddCars className="bg-white rounded-xl shadow-md p-6" />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard className="bg-white rounded-xl shadow-md p-6" />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            {/* All other routes are publicly accessible */}
            <Route
              path="/all-cars"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AllCarsList className="bg-white rounded-xl shadow-md p-6" />
                </motion.div>
              }
            />

            <Route
              path="/car-details/:carId"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CarDetails className="bg-white rounded-xl shadow-md p-6" />
                </motion.div>
              }
            />
            {token && userById.role === "customer" && (
              <Route
                path="/my-bookings"
                element={
                  <MyBookings className="bg-white rounded-xl shadow-md p-6" />
                }
              />
            )}

            {token && userById.role === "admin" && (
              <Route
                path="/all-users"
                element={
                  <AllUsers className="bg-white rounded-xl shadow-md p-6" />
                }
              />
            )}

            {token && userById.role === "admin" && (
              <Route
                path="/cars"
                element={
                  <AllCars className="bg-white rounded-xl shadow-md p-6" />
                }
              />
            )}

            {token && (
              <Route
                path="/profile"
                element={
                  <Profile className="bg-white rounded-xl shadow-md p-6" />
                }
              />
            )}

            {token && (
              <Route
                path="/print-voucher/:id"
                element={
                  <Voucher className="bg-white rounded-xl shadow-md p-6" />
                }
              />
            )}

            {/* Catch-all route - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* <Route path="/success" element={<Success />} /> */}
          </Routes>
        </div>
      </main>

      {/* Sticky footer - Don't show on auth pages */}
      {!["/login", "/signup"].includes(location.pathname) && (
        <footer className="shrink-0 text-white py-8 mt-16 bg-gradient-to-b from-blue-200 via-green-200 to-blue-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Footer className="grid grid-cols-1 md:grid-cols-4 gap-8 " />
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
