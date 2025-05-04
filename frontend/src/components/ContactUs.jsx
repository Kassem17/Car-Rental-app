import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import { AppContext } from "../context/AppContext";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { locations } = useContext(AppContext);
  const [showAll, setShowAll] = useState(false);

  return (
    <div id="contact">
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have questions or want to discuss a project? We'd love to hear from
            you!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-sky-100 rounded-full text-sky-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Email Us</h4>
                    <a
                      href="mailto:hello@rideon.com"
                      className="text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      kassem@demo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Call Us</h4>
                    <a
                      href="tel:+1234567890"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      +961 71343792
                    </a>
                  </div>
                </div>

                {locations.length > 0 && (
                  <div className="space-y-4">
                    {(showAll ? locations : locations.slice(0, 2)).map(
                      (location) => (
                        <div
                          key={location.id}
                          className="flex items-start space-x-4"
                        >
                          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">
                              {location.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Latitude: {location.latitude}
                              <br />
                              Longitude: {location.longitude}
                            </p>
                          </div>
                        </div>
                      )
                    )}

                    {locations.length > 2 && (
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center text-sm text-purple-600 font-medium hover:underline mt-2"
                      >
                        {showAll ? "Show less" : "Show more"}
                        {showAll ? (
                          <ChevronUp className="ml-1 w-4 h-4" />
                        ) : (
                          <ChevronDown className="ml-1 w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Business Hours
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h3>

            <form
              action="https://getform.io/f/bnlqoeob"
              method="POST"
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.300248914112!2d35.4960461!3d33.8937913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f170dcfaefc0f%3A0x6e71f75470fbbd4d!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2slb!4v1714440000000!5m2!1sen!2slb"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-2xl"
          />
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ContactUs;
