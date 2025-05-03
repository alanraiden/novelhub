import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeContext from "../context/DarkModeContext";
import axios from "axios";
import { FaComments, FaHeart, FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

function Forum() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      const sortedPosts = response.data
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 3);
      setPosts(sortedPosts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [posts]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-[300px] md:h-[400px] ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      } rounded-xl`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-10 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-10 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <p>No posts available</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    } transition-colors duration-300`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`relative h-[300px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
          } transition-colors duration-300`}
          onClick={() => navigate("/forum")}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0">
            <div className={`w-full h-full ${
              isDarkMode 
                ? 'bg-black/50' 
                : 'bg-gray-100/50'
            }`}></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col md:flex-row items-center p-4 md:p-8">
            <div className="flex flex-col gap-4 md:gap-6 w-full md:w-auto">
              {/* Author Info */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className={`p-3 md:p-4 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  <FaComments className="text-white text-xl md:text-3xl" />
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    by {posts[currentIndex].user?.name || "Anonymous"}
                  </span>
                </div>
              </motion.div>

              {/* Post Content */}
              <div className={`max-w-full md:max-w-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent line-clamp-2"
                >
                  {posts[currentIndex].title}
                </motion.h3>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-sm md:text-lg mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {posts[currentIndex].content}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-6 md:gap-10 text-sm md:text-base"
                >
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-red-500" />
                    <span>{posts[currentIndex].likes?.length || 0} Likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaComments className="text-blue-500" />
                    <span>{posts[currentIndex].comments?.length || 0} Comments</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Navigation Controls - Hidden on Mobile */}
          <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className={`p-2 m-4 rounded-full transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <FaChevronLeft size={24} />
            </button>
          </div>
          <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className={`p-2 m-4 rounded-full transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <FaChevronRight size={24} />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? isDarkMode 
                      ? 'bg-white scale-125' 
                      : 'bg-gray-800 scale-125'
                    : isDarkMode
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Forum;
