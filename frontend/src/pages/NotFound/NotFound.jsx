import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg w-full text-center p-10 bg-white rounded-3xl shadow-xl">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <div className="text-9xl font-extrabold text-indigo-600 mb-6">
            404
          </div>
        </motion.div>

        <h1 className="text-4xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-10">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-all"
          >
            Go Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
          >
            Return Home
          </motion.button>
        </div>
      </div>

      <motion.div
        className="mt-12 text-gray-500 text-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Need help?{" "}
        <a
          href="mailto:kassemh294@gmail.com?subject=Support Request"
          className="text-indigo-600 hover:underline"
        >
          Email Support
        </a>{" "}
        or{" "}
        <Link to="/#contact" className="text-indigo-600 hover:underline">
          Contact support
        </Link>
      </motion.div>
    </motion.div>
  );
}
