import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DarkModeContext from "../context/DarkModeContext";
import { FaHeart, FaBookOpen, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

function WeeklyBest() {
  const [novels, setNovels] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const fetchNovels = async () => {
    try {
      const response = await axios.get(`${API_URL}/novels`);
      const sortedNovels = response.data
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 3);
      setNovels(sortedNovels);
    } catch (err) {
      setError("Failed to fetch novels");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNovels();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % novels.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [novels]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? novels.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === novels.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (error) {
    return (
      <div className={`text-center py-10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-[350px] ${isDarkMode ? 'bg-black/80' : 'bg-white/80'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (novels.length === 0) {
    return (
      <div className={`text-center py-10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <p>No novels available</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${isDarkMode ? 'bg-black/80' : 'bg-white/80'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
          onClick={() => navigate(`/novels/${novels[currentIndex]._id}`)}
        >
          <div className="absolute inset-0">
            <img
              src={novels[currentIndex].coverPhoto.url}
              alt="background"
              className="w-full h-full object-cover filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="relative h-full flex items-center p-8">
            <div className="flex gap-8 items-center">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={novels[currentIndex].coverPhoto.url}
                alt={novels[currentIndex].title}
                className="w-48 h-73 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />

              <div className={"max-w-xl text-white"}>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                >
                  {novels[currentIndex].title}
                </motion.h3>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={"text-lg mb-6 line-clamp-3 text-gray-300"}
                >
                  {novels[currentIndex].description}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-10"
                >
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-red-500" />
                    <span>{novels[currentIndex].likes?.length || 0} Likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="text-blue-500" />
                    <span>{novels[currentIndex].chapters?.length || 0} Chapters</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <span>{novels[currentIndex].rating || 0} Rating</span>
                  </div> */}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className={"p-2 m-4 rounded-full bg-white/10 hover:bg-white/20 text-white"}
            >
              <FaChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className={"p-2 m-4 rounded-full bg-white/10 hover:bg-white/20 text-white"}
            >
              <FaChevronRight size={24} />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {novels.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? isDarkMode 
                      ? 'bg-white scale-125' 
                      : 'bg-black scale-125'
                    : isDarkMode 
                      ? 'bg-white/30 hover:bg-white/50' 
                      : 'bg-black/30 hover:bg-black/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default WeeklyBest;
