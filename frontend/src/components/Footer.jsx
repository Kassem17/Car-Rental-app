import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-indigo-400 via-pink-300 to-yellow-400 text-gray-900 py-20 mt-20 overflow-hidden">
      {/* Decorative blur shapes */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300/20 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-center md:text-left">
          {/* Column 1: About */}
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-white">Rideon</h3>
            <p className="text-lg text-gray-100 leading-relaxed">
              Your trusted companion for premium car rentals. Comfort,
              convenience, and class — all in one place.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-100">
              {["Home", "Services", "Contact", "Login"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-100 hover:text-blue-500 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-100">
              {["Privacy Policy", "Terms of Service", "FAQs", "Support"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-100 hover:text-blue-500 transition"
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
            <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex justify-center space-x-6 text-3xl text-gray-100">
              <a href="#" className="hover:text-blue-500 transition">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-pink-600 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-sky-500 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-indigo-500 transition">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 mt-16 text-center text-sm text-gray-100 border-t border-gray-200 pt-6">
          &copy; {new Date().getFullYear()} Rideon. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
