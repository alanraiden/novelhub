import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";
import PostUpload from "../components/PostUpload";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeContext from "../context/DarkModeContext";
import LoadingScreen from "../utils/LoadingScreen";
import Footer from "../utils/Footer";

const API_URL = import.meta.env.VITE_API_URL;

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newComments, setNewComments] = useState({});
  const { isDarkMode } = useContext(DarkModeContext);

  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      let sortedPosts = [...response.data];
      sortedPosts.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    }
  };

  const handleLike = async (postId) => {
    if (!userId || !token) return;
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleAddComment = async (postId) => {
    if (!userId || !token || !newComments[postId]?.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comments`,
        {
          content: newComments[postId],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );
      setNewComments((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <div
            className={`min-h-screen pt-20 ${
              isDarkMode
                ? "bg-gradient-to-br from-black to-gray-800 text-white"
                : "bg-gray-50 text-gray-900"
            }`}
          >
            <div className="max-w-4xl mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-800"
                    : "bg-white"
                } rounded-xl shadow-lg p-6 mb-8 backdrop-blur-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center px-8">
                  {/* <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <i className="bx bx-user text-xl"></i>
              </div> */}
                  <button
                    onClick={() => setShowNewPostForm(true)}
                    className={`flex-1 text-left px-6 py-3 ${
                      isDarkMode
                        ? "bg-black hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    } rounded-full transition-all duration-300 transform hover:-translate-y-0.5`}
                  >
                    Share your thoughts with the community...
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewPostForm(true)}
                    className={`p-3 text-blue-500 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                    } rounded-full transition-colors`}
                  >
                    <i className="bx bx-image-alt text-2xl"></i>
                  </motion.button>
                </div>
              </motion.div>

              <div className="space-y-8">
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${
                        isDarkMode
                          ? "bg-gradient-to-br from-gray-900 to-black"
                          : "bg-white"
                      } rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                            {post.user.userimage ? (
                              <img
                                src={post.user.userimage}
                                alt={post.user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <i className="bx bx-user text-xl"></i>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold text-lg ${
                                isDarkMode ? "text-gray-100" : "text-gray-800"
                              }`}
                            >
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{post.user.name}</span>
                              <span>•</span>
                              <span>
                                {new Date(post.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {post.image && (
                          <motion.div
                            className="relative rounded-xl overflow-hidden mb-4"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img
                              src={post.image.url}
                              alt={post.title}
                              className="w-full max-h-[500px] object-cover"
                            />
                          </motion.div>
                        )}

                        <p
                          className={`whitespace-pre-wrap mb-6 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {post.content}
                        </p>

                        <div
                          className={`flex items-center justify-between pt-4 border-t ${
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleLike(post._id)}
                              className="flex items-center gap-2 transition-colors"
                            >
                              {post.likes?.includes(userId) ? (
                                <FaHeart className="text-red-500 text-xl" />
                              ) : (
                                <FaRegHeart
                                  className={`text-xl ${
                                    isDarkMode
                                      ? "text-gray-400 hover:text-red-400"
                                      : "text-gray-500 hover:text-red-500"
                                  }`}
                                />
                              )}
                              <span
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {post.likes?.length || 0}
                              </span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleComments(post._id)}
                              className={`flex items-center gap-2 ${
                                isDarkMode
                                  ? "text-gray-400 hover:text-blue-400"
                                  : "text-gray-500 hover:text-blue-500"
                              }`}
                            >
                              <FaComment className="text-xl" />
                              <span>{post.comments?.length || 0}</span>
                            </motion.button>

                            {/* <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center gap-2 ${
                            isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                          }`}
                        >
                          <FaShare className="text-xl" />
                        </motion.button> */}
                          </div>

                          {/* <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleBookmark(post._id)}
                        className={`${
                          isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-500'
                        }`}
                      >
                        {bookmarkedPosts[post._id] ? (
                          <FaBookmark className="text-xl text-yellow-500" />
                        ) : (
                          <FaRegBookmark className="text-xl" />
                        )}
                      </motion.button> */}
                        </div>

                        <AnimatePresence>
                          {expandedComments[post._id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 space-y-4"
                            >
                              {post.comments?.map((comment) => (
                                <motion.div
                                  key={comment._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`p-4 rounded-lg ${
                                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                                  }`}
                                >
                                  <p
                                    className={
                                      isDarkMode
                                        ? "text-gray-200"
                                        : "text-gray-700"
                                    }
                                  >
                                    {comment.content}
                                  </p>
                                  <p
                                    className={
                                      isDarkMode
                                        ? "text-gray-500"
                                        : "text-gray-700"
                                    }
                                  >
                                    {comment.user?.name || "Anonymous"}
                                  </p>
                                </motion.div>
                              ))}

                              <div className="flex items-center gap-3 mt-4">
                                <input
                                  type="text"
                                  value={newComments[post._id] || ""}
                                  onChange={(e) =>
                                    handleCommentChange(
                                      post._id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add a comment..."
                                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                    isDarkMode
                                      ? "bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                                      : "bg-gray-100 text-gray-900 border-gray-200 focus:border-blue-500"
                                  } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAddComment(post._id)}
                                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                  Post
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {showNewPostForm && (
                <PostUpload
                  onClose={() => setShowNewPostForm(false)}
                  onSuccess={fetchPosts}
                />
              )}
            </AnimatePresence>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default ForumPage;
