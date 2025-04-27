import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8  ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-600">Our Company</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the way people experience car rentals with
            innovative solutions and exceptional service.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
              alt="Our team"
              className="w-full h-auto object-cover aspect-video"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm font-medium">Our dedicated team at work</p>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
              <p className="text-gray-600">
                Founded in 2015, Rideon began with a simple mission: to make car
                rental seamless and enjoyable. What started as a small local
                service has grown into a trusted international brand serving
                thousands of customers across multiple countries.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              <p className="text-gray-600">
                We're committed to providing exceptional mobility solutions
                through cutting-edge technology, eco-friendly vehicles, and
                personalized service that puts our customers first.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {[
                { value: "10K+", label: "Happy Customers" },
                { value: "500+", label: "Vehicles" },
                { value: "25+", label: "Cities" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center"
                >
                  <p className="text-2xl font-bold text-blue-600">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Meet Our Leadership
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sarah Chen",
                role: "CTO",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Marcus Lee",
                role: "Operations Director",
                image: "https://randomuser.me/api/portraits/men/75.jpg",
              },
              {
                name: "Elena Rodriguez",
                role: "Customer Experience",
                image: "https://randomuser.me/api/portraits/women/63.jpg",
              },
            ].map((member, index) => (
              <div key={member.name} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h4>
                <p className="text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
