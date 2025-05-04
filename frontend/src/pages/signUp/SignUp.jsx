import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import useSignUp from "../../hooks/useSignUp";

const SignUp = () => {
  const { signUp, loading } = useSignUp();
  // fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
    confirmPassword: false,
  });

  const cars = [
    {
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      name: "Mercedes S-Class",
      description: "The pinnacle of luxury sedans",
    },
    {
      image:
        "https://images-porsche.imgix.net/-/media/3A6188B4DDBD4F44808E01F877E550A3_807C7768A6F34454B3160A5C6BC7A064_911-turbo-s-rear?w=999&q=85&auto=format",
      name: "Porsche 911",
      description: "Iconic sports car performance",
    },
    {
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      name: "Audi R8",
      description: "Supercar engineering excellence",
    },
    {
      image:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      name: "Range Rover",
      description: "Ultimate luxury SUV",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarIndex((prev) => (prev + 1) % cars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cars.length]);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      setError("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isValid) {
      setError("Please enter a valid Lebanese phone number.");
      return;
    }
    setError("");
    await signUp({ name, email, password, confirmPassword, phoneNumber });
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (input.length > 0) {
      formatted = input.substring(0, 8);
      if (formatted.length > 2) {
        formatted = `${formatted.substring(0, 2)} ${formatted.substring(2)}`;
      }
      if (formatted.length > 6) {
        formatted = `${formatted.substring(0, 6)} ${formatted.substring(6)}`;
      }
    }

    setPhoneNumber(formatted);
    validatePhoneNumber(formatted);
  };

  const validatePhoneNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, "");
    const isValid = /^(0?[1378]|7[016-9]|81)\d{6}$/.test(cleanNumber);
    setIsValid(isValid || cleanNumber.length === 0);
  };

  const nextCar = () => {
    setCurrentCarIndex((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    setCurrentCarIndex((prev) => (prev - 1 + cars.length) % cars.length);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Car Showcase */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-1/2 bg-black items-center justify-center relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCarIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={cars[currentCarIndex].image}
              alt={cars[currentCarIndex].name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 px-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between absolute top-1/2 w-full left-0 px-8"
          >
            <button
              onClick={prevCar}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextCar}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
            >
              <FaChevronRight />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white mt-auto pb-16"
          >
            <h2 className="text-4xl font-bold mb-2">
              {cars[currentCarIndex].name}
            </h2>
            <p className="text-xl text-white/80 mb-6">
              {cars[currentCarIndex].description}
            </p>
            <div className="flex gap-2">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentCarIndex
                      ? "bg-white w-8"
                      : "bg-white/30 w-4"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-500">Join our community</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-5"
          >
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <motion.div
                animate={{
                  borderColor: isFocused.name ? "#000000" : "#e5e7eb",
                  boxShadow: isFocused.name
                    ? "0 0 0 3px rgba(0, 0, 0, 0.05)"
                    : "none",
                }}
                className="relative rounded-lg border transition-all duration-300"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, name: true })}
                  onBlur={() => setIsFocused({ ...isFocused, name: false })}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                />
                <FaUser className="absolute top-3.5 left-3 text-gray-400" />
              </motion.div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">Email</label>
              <motion.div
                animate={{
                  borderColor: isFocused.email ? "#000000" : "#e5e7eb",
                  boxShadow: isFocused.email
                    ? "0 0 0 3px rgba(0, 0, 0, 0.05)"
                    : "none",
                }}
                className="relative rounded-lg border transition-all duration-300"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                />
                <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
              </motion.div>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">
                Lebanese Phone
              </label>
              <motion.div
                animate={{
                  borderColor: isFocused.phoneNumber ? "#000000" : "#e5e7eb",
                  boxShadow: isFocused.phoneNumber
                    ? "0 0 0 3px rgba(0, 0, 0, 0.05)"
                    : "none",
                }}
                className="relative rounded-lg border transition-all duration-300"
              >
                <div className="absolute left-3 top-3.5 flex items-center">
                  <span className="text-gray-500 mr-1">+961</span>
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onFocus={() =>
                    setIsFocused({ ...isFocused, phoneNumber: true })
                  }
                  onBlur={() =>
                    setIsFocused({ ...isFocused, phoneNumber: false })
                  }
                  placeholder="XX XXX XXX"
                  className={`w-full pl-20 pr-4 py-3 rounded-lg focus:outline-none ${
                    !isValid && phoneNumber ? "border-red-500" : ""
                  }`}
                  maxLength={10}
                />
              </motion.div>
              {!isValid && phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  Please enter a valid Lebanese number
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <motion.div
                animate={{
                  borderColor: isFocused.password ? "#000000" : "#e5e7eb",
                  boxShadow: isFocused.password
                    ? "0 0 0 3px rgba(0, 0, 0, 0.05)"
                    : "none",
                }}
                className="relative rounded-lg border transition-all duration-300"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none"
                />
                <FaLock className="absolute top-3.5 left-3 text-gray-400" />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <motion.div
                animate={{
                  borderColor: isFocused.confirmPassword
                    ? "#000000"
                    : "#e5e7eb",
                  boxShadow: isFocused.confirmPassword
                    ? "0 0 0 3px rgba(0, 0, 0, 0.05)"
                    : "none",
                }}
                className="relative rounded-lg border transition-all duration-300"
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() =>
                    setIsFocused({ ...isFocused, confirmPassword: true })
                  }
                  onBlur={() =>
                    setIsFocused({ ...isFocused, confirmPassword: false })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none"
                />
                <FaLock className="absolute top-3.5 left-3 text-gray-400" />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#000000" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300"
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Sign Up <FaArrowRight />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-black hover:text-gray-700"
            >
              Log in
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;