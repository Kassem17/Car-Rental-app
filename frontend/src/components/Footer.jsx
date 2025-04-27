import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-700 py-16 mt-20 overflow-hidden">
      {/* Decorative blur shapes */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300/20 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-700">Rideon</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted companion for premium car rentals. Comfort,
              convenience, and class — all in one place.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Services", "Contact", "Login"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "FAQs", "Support"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Follow Us
            </h3>
            <div className="flex space-x-4 text-2xl text-gray-600">
              <a href="#" className="hover:text-blue-500 transition">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-pink-500 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-sky-500 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 mt-14 text-center text-sm text-gray-500 border-t border-gray-300 pt-6">
          &copy; {new Date().getFullYear()} Rideon. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
