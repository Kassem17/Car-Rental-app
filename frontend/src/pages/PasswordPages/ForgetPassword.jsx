import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/auth/forgot-password", {
        email,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          <p className="text-indigo-100 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Send Reset Link
            </button>
            <p>{message}</p>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Login
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            Didn't receive email? Check spam folder or{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              resend
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
