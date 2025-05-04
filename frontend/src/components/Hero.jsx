import React, { useContext } from "react";
import carImage from "../../public/car.png";
import { motion } from "framer-motion";
import { Car, MapPin, Star, StarHalf } from "lucide-react"; // icons
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const navigate = useNavigate();
  const { reviews, allCars } = useContext(AppContext);
  // const repeatedReviews = reviews.concat(reviews); // Duplicate for smooth marquee

  const highestRating = Math.max(...reviews.map((r) => r.rating));

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-5 w-5 text-yellow-400 fill-current"
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-5 w-5 text-yellow-400 fill-current" />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-5 w-5 text-gray-300 fill-current"
        />
      );
    }

    return stars;
  };

  return (
    <section
      id="hero"
      className="w-full bg-gradient-to-br from-sky-100 to-blue-200 py-16 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-sky-200 opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-sky-300 opacity-15 blur-lg"></div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-12 md:gap-20 md:flex-row items-center justify-between relative z-10">
        {/* Left: Text Content */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block mb-4 px-4 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium">
            Premium Car Rentals
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
              Elevate Your Journey
            </span>
            <br />
            With Rideon Excellence
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Experience the freedom of the open road with our curated collection
            of premium vehicles.
            <span className="block mt-2 font-medium text-sky-600">
              No hidden fees. No compromises. Just pure driving pleasure.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <motion.button
              onClick={() => navigate("/all-cars")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Book Your Ride Now
            </motion.button>
          </div>

          {/* Icons with hover effects */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Car className="h-6 w-6" />, text: `${allCars.length}+` },
              { icon: <MapPin className="h-6 w-6" />, text: "50+ Locations" },
              {
                icon: <Star className="h-6 w-6 text-yellow-500" />,
                text: `${highestRating.toFixed(1)}/5 Rating`,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white shadow-sm"
              >
                <div className="p-2 mb-1 bg-sky-100 rounded-full text-sky-600">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Image with parallax effect */}
        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative">
            <img
              src={carImage}
              alt="Premium car for rent"
              className="w-full h-auto rounded-3xl shadow-2xl object-cover transform -rotate-1"
            />
            {/* Floating badge */}
            {/* <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-full shadow-lg border border-sky-100 flex items-center"
            >
              <div className="mr-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Available Now
              </span>
            </motion.div> */}
          </div>

          {/* Decorative card behind image */}
          <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full border-2 border-sky-200 rounded-3xl"></div>
        </motion.div>
      </div>

      {/* Scrolling testimonials at bottom */}
      <div className="mt-16 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {reviews.map((review, i) => (
            <div key={i} className="inline-flex items-center mx-8">
              <div className="text-lg font-medium text-gray-700 mr-4">
                {review.userName}:
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
