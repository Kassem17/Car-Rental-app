import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import useGetUserById from "../hooks/useGetUserById";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, setToken, userById } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserById } = useGetUserById();

  useEffect(() => {
    if (token) {
      getUserById(token);
    }
  }, [token]);

  const handleNavigation = (target) => {
    if (location.pathname === "/") {
      // If already on home page, just scroll
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If on another page, navigate to home then scroll
      navigate("/");
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Small delay to allow page transition
    }
    setIsOpen(false);
  };

  const navItems = [
    ...(userById.role !== "admin"
      ? [
          { path: "hero", name: "Home" },
          { path: "cars", name: "Cars" },
          { path: "services", name: "Services" },
          { path: "about", name: "About" },
          { path: "contact", name: "Contact" },
        ]
      : []),

    ...(token && userById.role === "customer"
      ? [{ path: "/my-bookings", name: "MyBookings", type: "route" }]
      : []),

    ...(token && userById.role === "admin"
      ? [
          { path: "/add-cars", name: "Add Cars", type: "route" },
          { path: "/dashboard", name: "Dashboard", type: "route" },
        ]
      : []),
  ];

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left side: Logo + Brand */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <motion.div
            onClick={() => navigate("/")}
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="/logo.svg"
              className="h-10 w-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg p-1 shadow-md"
              alt="Rideon Logo"
            />
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Rideon
            </span>
          </motion.div>
        </div>
        {token && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            }}
            className="text-gray-700 text-xl flex items-center gap-2"
          >
            <motion.span
              animate={{
                rotate: [0, 15, -15, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
              className="text-4xl"
            >
              👋
            </motion.span>
            Welcome{" "}
            <motion.span
              onClick={() => navigate("/profile")}
              animate={{
                textShadow: [
                  "0px 0px 0px #6366f1",
                  "0px 0px 6px #6366f1",
                  "0px 0px 12px #6366f1",
                  "0px 0px 6px #6366f1",
                  "0px 0px 0px #6366f1",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="font-semibold text-indigo-600 ml-1 cursor-pointer"
            >
              {userById.name}
            </motion.span>
          </motion.div>
        )}
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <button
                onClick={() => {
                  if (item.type === "route") {
                    navigate(item.path);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-sky-600 transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-sky-500 w-0 group-hover:w-3/4 transition-all duration-300"></span>
              </button>
            </motion.div>
          ))}

          {/* Auth Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="ml-4"
          >
            {token ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken(null);
                  navigate("/login");
                }}
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                Login
              </Link>
            )}
          </motion.div>
        </div>
        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 "
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute top-16 right-4 w-64 bg-white rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      if (item.path === "/my-bookings") {
                        navigate("/my-bookings");
                        setIsOpen(false);
                      } else if (item.path === "/add-cars") {
                        navigate("/add-cars");
                        setIsOpen(false);
                      } else if (item.path === "/dashboard") {
                        navigate("/dashboard");
                        setIsOpen(false);
                      } else {
                        handleNavigation(item.path);
                      }
                    }}
                    className="px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition-colors text-left"
                  >
                    {item.name}
                  </button>
                ))}

                <div className="border-t border-gray-200 my-1"></div>

                {token ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setToken(null);
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-left text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
