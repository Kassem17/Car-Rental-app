import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { extractTime } from "../utils/extractTime";
import { Widget } from "@uploadcare/react-widget";
import useUpdateProfile from "../hooks/useUpdateProfile";
import { FaPhone, FaRegSave } from "react-icons/fa";

const Profile = () => {
  const { userById } = useContext(AppContext);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const { updateProfile, loading } = useUpdateProfile();

  const [phoneNumber, setPhoneNumber] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const handleImageUpload = (url) => {
    setProfileImageUrl(url);
  };

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

  const handleUpdate = async () => {
    const profileData = {
      phoneNumber,
      profileImageUrl,
    };

    try {
      await updateProfile(profileData);
    } catch (error) {
      console.log(error);
    }

    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="relative bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {/* Profile Info */}
          <div className="px-8 -mt-16 flex items-center space-x-6 relative z-10">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
              {edit ? (
                <Widget
                  publicKey="7daf2c8b2552e057e89c"
                  onChange={(fileInfo) => handleImageUpload(fileInfo.cdnUrl)}
                  className="hidden"
                />
              ) : userById.avatar ? (
                <img
                  src={userById.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-500">
                  {userById.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                {userById.name}
              </h1>
              <p className="text-gray-500">{userById.email}</p>
            </div>

            {edit ? (
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`inline-flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold shadow-md hover:from-emerald-400 hover:to-cyan-400 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
                      />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaRegSave className="h-5 w-5" />
                    <span>Save</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setEdit(true)}
                className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="px-8 py-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-center bg-white">
            {userById.role === "customer" && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Rentals</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {userById?.bookings.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {extractTime(userById.createdAt)}
                  </p>
                </div>
              </>
            )}
            {userById.role === "admin" && (
              <div className="col-span-2 md:col-span-3 text-indigo-700 font-bold text-xl">
                Admin
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white shadow-2xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Personal Information
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{userById.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{userById.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {edit ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col"
                >
                  <label className="text-sm text-gray-600 mb-2">
                    Lebanese Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 flex items-center space-x-1 text-gray-400">
                      <span>+961</span>
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="XX XXX XXX"
                      maxLength={10}
                      className={`pl-20 pr-4 py-2 w-full border rounded-lg focus:outline-none ${
                        isValid
                          ? "border-gray-300 focus:ring-2 focus:ring-indigo-300"
                          : "border-red-500 focus:ring-2 focus:ring-red-400"
                      } transition`}
                    />
                  </div>
                  {!isValid && phoneNumber && (
                    <p className="text-xs text-red-500 mt-1">
                      Invalid Lebanese number format
                    </p>
                  )}
                </motion.div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {userById.phoneNumber
                      ? `+961 ${userById.phoneNumber}`
                      : "Not provided"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Rentals */}
        {userById.role === "customer" && (
          <div className="bg-white shadow-2xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Recent Rentals
            </h2>
            <button
              onClick={() => navigate("/my-bookings")}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Rentals
              <svg
                className="h-5 w-5 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 1.414l-4-4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
