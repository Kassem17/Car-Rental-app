import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import useSignUp from "../../hooks/useSignUp";
import { FaPhone, FaChevronDown } from "react-icons/fa";

const SignUp = () => {
  const { signUp, loading } = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

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
    setError("");
    // handle real signup logic here
    await signUp({ name, email, password, confirmPassword, phoneNumber });
  };

  // Format and validate Lebanese phone number
  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove all non-digits
    let formatted = "";

    if (input.length > 0) {
      formatted = input.substring(0, 8); // Max 8 digits (7 digits + 1 for potential 0)

      // Format as XX XXX XXX (with first digit being 0 for landlines)
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
    // Validate Lebanese mobile numbers (71, 76, 78, 79, etc.) and landlines (01)
    const isValid = /^(0?[1378]|7[016-9]|81)\d{6}$/.test(cleanNumber);
    setIsValid(isValid || cleanNumber.length === 0);
  };

  return (
    <div className="flex items-center justify-center w-[80vh] h-[80vh] bg-gradient-to-br from-blue-400 to-green-300 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-white/70 shadow-2xl rounded-2xl px-10 py-8 flex flex-col gap-6 w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Sign Up
        </motion.h1>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <label className="mb-1 text-gray-700">Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <FaUser className="absolute top-3 left-3 text-gray-400" />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col"
        >
          <label className="mb-1 text-gray-700">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          </div>
        </motion.div>
        {/* Phone number */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col"
        >
          <label className="mb-1 text-gray-700">Lebanese Phone Number</label>
          <div className="relative">
            <div className="absolute left-3 top-3 flex items-center">
              <span className="text-gray-500 mr-1">+961</span>
              <FaPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Enter your phone number"
              className={`pl-20 pr-3 py-2 w-full border ${
                isValid ? "border-gray-300" : "border-red-500"
              } rounded-lg focus:outline-none focus:ring-2 ${
                isValid ? "focus:ring-purple-400" : "focus:ring-red-400"
              } transition`}
              maxLength={10} // 2 + space + 3 + space + 3 = 10
            />
          </div>
          {!isValid && phoneNumber && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid Lebanese number
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Format: XX XXX XXX</p>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col"
        >
          <label className="mb-1 text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-2.5 right-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col"
        >
          <label className="mb-1 text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute top-2.5 right-3 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-purple-500 text-white py-2 rounded-lg font-semibold transition duration-300 hover:bg-purple-600"
          >
            Sign Up
          </motion.button>
          <span className="text-center text-sm text-gray-700">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:underline font-medium"
            >
              Log In
            </a>
          </span>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default SignUp;
