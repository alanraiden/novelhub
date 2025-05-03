import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaHeart, FaRegHeart, FaComment, FaClock } from "react-icons/fa";
import WriteReview from "./WriteReview";
import DarkModeContext from "../context/DarkModeContext";

const NovelReviews = ({ reviews, novelId }) => {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleReviewLike = async (reviewId, e) => {
    e.stopPropagation(); // Prevent triggering the review click
    try {
      if (!userId || !token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/novel-reviews/${reviewId}/toggle-like`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLocalReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? response.data : review
        )
      );
    } catch (err) {
      console.error("Review like error:", err);
    }
  };

  const handleReviewClick = (reviewId) => {
    navigate(`/novels/${novelId}/reviews/${reviewId}`);
  };

  const handleNewReview = (newReview) => {
    setLocalReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  return (
    <div
      className={`max-w-7xl mx-auto ${
        isDarkMode
          ? "bg-gradient-to-br from-black/100 to-gray-700"
          : "bg-gradient-to-br from-gray-50 to-white"
      } rounded-xl shadow-lg hover:shadow-xl transition-colors duration-300 p-8 mt-8`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <h2
          className={`text-3xl font-extrabold ${
            isDarkMode
              ? "bg-gradient-to-r from-purple-200 to-purple-800 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent"
          }`}
        >
          Community Reviews
        </h2>
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
        >
          Write a Review
        </button>
      </div>

      <div className="space-y-6">
        {localReviews.length > 0 ? (
          localReviews.map((review) => (
            <div
              key={review._id}
              onClick={() => handleReviewClick(review._id)}
              className={`group relative p-6 rounded-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                isDarkMode
                  ? "bg-gray-800/50 hover:bg-gray-700/50"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex-grow">
                  <h3
                    className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.reviewTitle}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <FaComment className="text-blue-500" />
                      <span>by {review.user?.name || "Anonymous"}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <FaClock className="text-blue-500" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleReviewLike(review._id, e)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    review.likes?.includes(userId)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {review.likes?.includes(userId) ? (
                    <FaHeart className="transform group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <FaRegHeart className="transform group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="font-medium">{review.likes?.length || 0}</span>
                </button>
              </div>
              <div className={`absolute bottom-0 left-0 w-full h-1 rounded-b-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                isDarkMode ? "bg-blue-600" : "bg-blue-500"
              }`}></div>
            </div>
          ))
        ) : (
          <div
            className={`text-center py-16 rounded-xl ${
              isDarkMode
                ? "bg-gray-800/50"
                : "bg-white"
            } shadow-lg`}
          >
            <p className={`text-xl font-medium mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              No reviews yet. Be the first to share your thoughts!
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Write First Review
            </button>
          </div>
        )}
      </div>

      {showReviewForm && (
        <WriteReview
          novelId={novelId}
          onSuccess={() => {
            setShowReviewForm(false);
          }}
          onClose={() => setShowReviewForm(false)}
          onNewReview={handleNewReview}
        />
      )}
    </div>
  );
};

export default NovelReviews;
