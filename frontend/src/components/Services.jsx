import React, { useState } from "react";

const services = () => {
  const [expandedSections, setExpandedSections] = useState({
    extras: false,
    partners: false,
    services: false,
  });

  // Toggle function
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
    <div className="mb-12 mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-center text-blue-500">
        Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Rideon Extras Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Rideon Extras
          </h4>
          <div className="flex flex-col space-y-3">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Protections
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Full tank options
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Young driver
            </a>

            {/* Expandable Content */}
            {expandedSections.extras && (
              <div className="mt-3 space-y-3 border-t pt-3 animate-fadeIn">
                <a
                  href="#"
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Additional Insurance
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Child Seat Rental
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Winter Package
                </a>
              </div>
            )}

            <button
              onClick={() => toggleSection("extras")}
              className="mt-2 text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
            >
              {expandedSections.extras ? "Show less" : "See all extras"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${
                  expandedSections.extras ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Our Partners Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Our Partners</h4>
          <div className="flex flex-col space-y-3">
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Shouqi - China
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Routes - Canada
            </a>

            {/* Expandable Content */}
            {expandedSections.partners && (
              <div className="mt-3 space-y-3 border-t pt-3 animate-fadeIn">
                <a
                  href="#"
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                >
                  AutoEurope - Europe
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                >
                  DriveNow - USA
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                >
                  GoRentals - Australia
                </a>
              </div>
            )}

            <button
              onClick={() => toggleSection("partners")}
              className="mt-2 text-green-600 font-medium hover:text-green-800 transition-colors flex items-center"
            >
              {expandedSections.partners ? "Show less" : "See all partners"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${
                  expandedSections.partners ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Rideon Services Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Rideon Services
          </h4>
          <div className="flex flex-col space-y-3">
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Privilege Loyalty Program
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Deliver & Collect
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Premium pick up Portugal
            </a>

            {/* Expandable Content */}
            {expandedSections.services && (
              <div className="mt-3 space-y-3 border-t pt-3 animate-fadeIn">
                <a
                  href="#"
                  className="block text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Corporate Fleet Solutions
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Airport Delivery Service
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Luxury Vehicle Concierge
                </a>
              </div>
            )}

            <button
              onClick={() => toggleSection("services")}
              className="mt-2 text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center"
            >
              {expandedSections.services ? "Show less" : "See all services"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${
                  expandedSections.services ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="mt-12 bg-gray-100 rounded-2xl overflow-hidden shadow-md">
        <div className="aspect-w-16 aspect-h-9 w-full h-64 md:h-80 flex items-center justify-center">
          <img src="/carImage.jpg" alt="" />
          {/* <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              Featured Partnership
            </h3>
            <p className="mt-1 text-gray-500">
              This space for your promotional content
            </p> */}
        </div>
      </div>
    </div>
  );
};

export default services;

// link for a car rental website
// https://www.europcar.com/en-us?utm_source=google&utm_medium=cpc&utm_campaign=%5BGOO%5D-%5BENG%5D-%5BCar%5D-%5BSource_Middle-East%5D-%5BDestination_FR%5D-%5Beuropcar.com%5D-%5BGeneric_Locations%5D-%5BPFX%5D&utm_term=nice%20car%20hiring&gad_source=1&gbraid=0AAAAADsbLR2XSGAZ0okPbhIBQvs8n43ZO&gclid=Cj0KCQjwtpLABhC7ARIsALBOCVp4n3EMOOI_kt0yofbGkGROYIFB4-Xw-Pv3wo6JwEnro5lIHlUYPxMaAt04EALw_wcB&gclsrc=aw.ds
