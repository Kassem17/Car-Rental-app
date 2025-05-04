import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/reset-password/${token}`,
        { password, confirmPassword }
      );
      setMessage(res.data.message);
      navigate("/login")
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-9 right-3 text-gray-500"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Reset Password
          </button>

          {message && (
            <p
              className={`text-sm text-center ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
