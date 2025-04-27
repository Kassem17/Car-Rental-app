import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import useLogin from "../../hooks/useLogin.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, loading } = useLogin();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");

    // Login logic here
    await login(email, password);
  };

  return (
    <div
      className=" bg-gradient-to-br from-blue-400 to-green-300
       flex items-center justify-center w-[80vh] h-[80vh] px-4 transition-colors"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md shadow-2xl rounded-2xl px-10 py-8 flex flex-col gap-6 w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-center"
        >
          Login
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <label className="mb-1">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col"
        >
          <label className="mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pl-10 pr-10 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2.5 right-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-purple-500 text-white py-2 rounded-lg font-semibold transition duration-300 hover:bg-purple-600"
          >
            Login
          </motion.button>
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-2 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <span className="text-center text-sm">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-purple-500 hover:underline font-medium"
            >
              Sign Up
            </a>
          </span>
        </motion.div>
      </motion.form>
    </div>
  );
}
