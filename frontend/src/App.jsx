import React, { useContext, useEffect } from "react";
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
import PaymentCancelled from "./pages/PaymentPages/PaymentCancelled";
import PaymentSuccess from "./pages/PaymentPages/PaymentSuccess"; // ✅ Import added
import NotFound from "./pages/NotFound/NotFound";
import ForgotPassword from "./pages/PasswordPages/ForgetPassword";
import ResetPassword from "./pages/PasswordPages/ResetPassword";

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
  }, [token]);

  // Updated ProtectedRoute for admin-only access
  const ProtectedRoute = ({ children, role }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    if (role && userById?.role !== role) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
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

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 transition-all duration-500 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                token && userById?.role === "admin" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Home />
                  </motion.div>
                )
              }
            />

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

            {/* Only admin can access /add-cars */}
            <Route
              path="/add-cars"
              element={
                <ProtectedRoute role="admin">
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

            {/* Only admin can access /dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="admin">
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

            {/* Additional routes for customers and admins */}
            {token && userById?.role === "customer" && (
              <Route
                path="/my-bookings"
                element={
                  <MyBookings className="bg-white rounded-xl shadow-md p-6" />
                }
              />
            )}

            {token && userById?.role === "admin" && (
              <>
                <Route
                  path="/all-users"
                  element={
                    <AllUsers className="bg-white rounded-xl shadow-md p-6" />
                  }
                />
                <Route
                  path="/cars"
                  element={
                    <AllCars className="bg-white rounded-xl shadow-md p-6" />
                  }
                />
              </>
            )}

            {token && (
              <>
                <Route
                  path="/profile"
                  element={
                    <Profile className="bg-white rounded-xl shadow-md p-6" />
                  }
                />
                <Route
                  path="/print-voucher/:id"
                  element={
                    <Voucher className="bg-white rounded-xl shadow-md p-6" />
                  }
                />
              </>
            )}

            {/* Payment Routes */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancelled />} />
            {/* Password Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

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
