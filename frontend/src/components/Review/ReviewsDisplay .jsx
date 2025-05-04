import React, { useContext,  useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ChevronDown, ChevronUp } from "react-feather";
import { MdOutlineStarRate } from "react-icons/md";

const ReviewsDisplay = () => {
  const { reviews,  backendUrl } = useContext(AppContext);
  const [visibleCount, setVisibleCount] = useState(3);


  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const visibleReviews = sortedReviews.slice(0, visibleCount);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex justify-center text-xl">
          <h3 className="text-2xl font-bold text-gray-800">Reviews</h3>
          <MdOutlineStarRate className="text-yellow-300" />
        </div>
        <span className="text-sm text-gray-500">
          {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {visibleReviews.length > 0 ? (
        <>
          <div className="space-y-6">
            {visibleReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-700">
                    {review.userName}
                  </h4>
                  <span className="text-sm text-yellow-500 font-medium">
                    {review.rating} / 5
                  </span>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        i < Math.floor(review.rating) ? "#FBBF24" : "#E5E7EB"
                      }
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path d="M12 .587l3.668 7.568L24 9.423l-6 5.854L19.335 24 12 19.897 4.665 24 6 15.277 0 9.423l8.332-1.268z" />
                    </svg>
                  ))}
                </div>
                {review.comment && (
                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Show More / Show Less Button */}
          <div className="flex justify-center mt-6">
            {visibleCount < reviews.length ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="text-xl font-medium text-blue-600 hover:underline flex"
              >
                Show more reviews <ChevronDown />
              </button>
            ) : reviews.length > 3 ? (
              <button
                onClick={() => setVisibleCount(3)}
                className="text-xl font-medium text-blue-600 hover:underline flex"
              >
                Show less <ChevronUp />
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <p className="text-gray-500 italic">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewsDisplay;
