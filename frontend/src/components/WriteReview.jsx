import { useState, useContext } from "react";
import axios from "axios";
import { FaTimes, FaPen, FaFantasyFlightGames } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeContext from "../context/DarkModeContext";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const WriteReview = ({ novelId, onSuccess, onClose, onNewReview }) => {
  const [reviewFormData, setReviewFormData] = useState({
    reviewTitle: "",
    reviewContent: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = Cookies.get("token");

  const handleReviewFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/novel-reviews/${novelId}/reviews`, {
        reviewTitle: reviewFormData.reviewTitle,
        reviewContent: reviewFormData.reviewContent,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const newReview = response.data;
      onNewReview(newReview);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`w-full max-w-2xl ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-white to-gray-50"
          } p-8 rounded-2xl shadow-2xl transform transition-all overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <FaFantasyFlightGames className={`text-2xl ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
              <h2 className={`text-3xl font-extrabold bg-gradient-to-r ${
                isDarkMode
                  ? "from-white to-purple-400"
                  : "from-purple-600 to-blue-600"
              } bg-clip-text text-transparent`}>
                Share Your Thoughts
              </h2>
            </motion.div>
            <button
              onClick={onClose}
              className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2"
            >
              <FaTimes className="text-lg" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleReviewFormSubmit} className="space-y-6">
            <div className="group">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Review Title
              </label>
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm`}>
                <input
                  type="text"
                  value={reviewFormData.reviewTitle}
                  onChange={(e) =>
                    setReviewFormData({
                      ...reviewFormData,
                      reviewTitle: e.target.value,
                    })
                  }
                  className={`w-full p-4 pr-12 outline-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-purple-500`}
                  placeholder="Give your review a catchy title"
                  required
                />
                <FaPen className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                }`} />
              </div>
            </div>

            <div className="group">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Your Review
              </label>
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm`}>
                <textarea
                  value={reviewFormData.reviewContent}
                  onChange={(e) =>
                    setReviewFormData({
                      ...reviewFormData,
                      reviewContent: e.target.value,
                    })
                  }
                  className={`w-full p-4 min-h-[200px] outline-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-purple-500`}
                  placeholder="Share your detailed thoughts about the novel..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 
                  bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                  text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                  ${isSubmitting ? "animate-pulse" : ""}`}
              >
                {isSubmitting ? "Submitting..." : "Share Review"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WriteReview;
