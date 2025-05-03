import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaUserCircle, FaClock, FaReply, FaPaperPlane, FaFantasyFlightGames } from "react-icons/fa";
import DarkModeContext from "../context/DarkModeContext";
import LoadingScreen from "../utils/LoadingScreen";
import Footer from "../utils/Footer";

const ReviewDetails = () => {
  const { reviewId } = useParams();
  const location = useLocation();
  const novelId = location.state?.novelId;
  const [review, setReview] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");
  const { isDarkMode } = useContext(DarkModeContext);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const reviewResponse = await axios.get(
          `${API_URL}/novel-reviews/${novelId}/reviews/${reviewId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReview(reviewResponse.data);
      } catch (err) {
        setError("Failed to fetch review details or replies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [reviewId, novelId]);

  const handleReplySubmit = async () => {
    if (!newReply.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/novel-reviews/${novelId}/reviews/${reviewId}`,
        { content: newReply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedReview = await axios.get(
        `${API_URL}/novel-reviews/${novelId}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReview(updatedReview.data);
      setNewReply("");
    } catch (err) {
      console.error("Failed to post reply", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyLike = async (replyId) => {
    if (!userId) return;

    setReview((prevState) => {
      if (!prevState || !prevState.replies) return prevState;
      const updatedReplies = prevState.replies.map((reply) => {
        if (reply._id === replyId) {
          const alreadyLiked = reply.likes.includes(userId);
          const updatedLikes = alreadyLiked
            ? reply.likes.filter((id) => id !== userId)
            : [...reply.likes, userId];
          return { ...reply, likes: updatedLikes };
        }
        return reply;
      });
      return { ...prevState, replies: updatedReplies };
    });

    try {
      await axios.post(
        `${API_URL}/novel-reviews/${reviewId}/replies/${replyId}/toggle-like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to toggle like", err);
      setReview((prevState) => {
        if (!prevState || !prevState.replies) return prevState;
        const updatedReplies = prevState.replies.map((reply) => {
          if (reply._id === replyId) {
            const alreadyLiked = reply.likes.includes(userId);
            const updatedLikes = alreadyLiked
              ? [...reply.likes, userId]
              : reply.likes.filter((id) => id !== userId);
            return { ...reply, likes: updatedLikes };
          }
          return reply;
        });
        return { ...prevState, replies: updatedReplies };
      });
    }
  };

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        } flex justify-center items-center`}
      >
        <div className="text-xl font-medium">{error}</div>
      </div>
    );
  if (!review)
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        } flex justify-center items-center`}
      >
        <div className="text-xl font-medium">Review not found</div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 to-black" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-4xl mx-auto ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-900"
              : "bg-gradient-to-br from-white to-gray-50"
          } rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <FaFantasyFlightGames
                className={`text-3xl ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <h2
                className={`text-4xl font-extrabold bg-gradient-to-r ${
                  isDarkMode
                    ? "from-blue-800 to-blue-400"
                    : "from-blue-600 to-blue-800"
                } bg-clip-text text-transparent`}
              >
                {review.reviewTitle}
              </h2>
            </div>

            <div
              className={`flex items-center gap-4 mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-xl" />
                <span className="font-medium">{review.user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-xl" />
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <p
              className={`text-lg leading-relaxed mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {review.reviewContent}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FaReply
                  className={`text-2xl ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h3
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Replies
                </h3>
              </div>

              <AnimatePresence>
                {review.replies && review.replies.length > 0 ? (
                  <motion.ul className="space-y-4">
                    {review.replies.map((reply, index) => (
                      <motion.li
                        key={reply._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl transition-all duration-300 ${
                          isDarkMode
                            ? "bg-gray-800/50 hover:bg-gray-700/50"
                            : "bg-white hover:bg-gray-50"
                        } shadow-lg hover:shadow-xl`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <p
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              } leading-relaxed`}
                            >
                              {reply.content}
                            </p>
                            <div
                              className={`mt-4 flex items-center gap-4 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <FaUserCircle />
                                <span>{reply.user?.name || "Anonymous"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaClock />
                                <span>
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleReplyLike(reply._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                              reply.likes?.includes(userId)
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {reply.likes?.includes(userId) ? (
                              <FaHeart className="text-lg" />
                            ) : (
                              <FaRegHeart className="text-lg" />
                            )}
                            <span className="font-medium">
                              {reply.likes?.length || 0}
                            </span>
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-lg ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } text-center py-8`}
                  >
                    No replies yet. Be the first to reply!
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div
                  className={`relative rounded-xl overflow-hidden ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-sm`}
                >
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className={`w-full p-4 min-h-[120px] outline-none transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800 text-white placeholder-gray-500"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    } focus:ring-2 focus:ring-purple-500`}
                    placeholder="Share your thoughts on this review..."
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleReplySubmit}
                    disabled={isSubmitting || !newReply.trim()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 
                                            bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                                            text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                                            ${
                                              isSubmitting
                                                ? "animate-pulse"
                                                : ""
                                            }`}
                  >
                    <FaPaperPlane
                      className={isSubmitting ? "animate-ping" : ""}
                    />
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewDetails;
