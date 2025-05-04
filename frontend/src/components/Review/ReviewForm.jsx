import React, { useContext, useState } from "react";
import ReactStars from "react-stars";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const {  backendUrl, token } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/review/submit-review",
        { rating, comment, userName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-10">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
      Leave a Review
    </h3>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <ReactStars
          count={5}
          size={32}
          value={rating}
          onChange={setRating}
          color2={"#FBBF24"} // Tailwind gold-400
        />
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />

        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition"
        >
          Submit Review
        </button>
      </div>
    </form>
  </div>
  );
};

export default ReviewForm;
