import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import DarkModeContext from "../context/DarkModeContext";
import { FaHeart, FaBookOpen } from "react-icons/fa";
import LoadingScreen from "../utils/LoadingScreen";
import Footer from "../utils/Footer";

const API_URL = import.meta.env.VITE_API_URL;

const Rankings = () => {
  const [topNovels, setTopNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    const fetchTopNovels = async () => {
      try {
        const response = await axios.get(`${API_URL}/novels`);
        const sortedNovels = response.data
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 10);
        setTopNovels(sortedNovels);
      } catch (err) {
        setError("Failed to fetch rankings", err);
      }
    };

    fetchTopNovels();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // if (error) {
  //   return (
  //     <div className={`min-h-screen ${isDarkMode ? 'bg-black/100' : 'bg-gray-50'}`}>
  //       <Navbar />
  //       <div className={`text-center mt-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</div>
  //     </div>
  //   );
  // }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-black/100" : "bg-gray-50"}`}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <div className="container mx-auto px-4 py-28">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-4xl font-bold text-center mb-12 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Top Novels
            </motion.h1>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto"
            >
              {topNovels.map((novel, index) => (
                <motion.div
                  key={novel._id}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-br from-black/50 to-gray-700 hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-600"
                      : "bg-gradient-to-br from-gray-200 to-white hover:bg-gradient-to-br hover:from-gray-300 hover:to-gray-100"
                  } rounded-xl shadow-lg mb-6 overflow-hidden cursor-pointer transition-all duration-300`}
                  onClick={() => navigate(`/novels/${novel._id}`)}
                >
                  <div className="flex items-center p-6">
                    <div className="flex-shrink-0 relative">
                      {/* Ranking Badge */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="absolute -left-4 -top-4 w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-800 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                      >
                        #{index + 1}
                      </motion.div>
                      <img
                        src={novel.coverPhoto.url}
                        alt={novel.title}
                        className="w-36 h-48 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="ml-8 flex-grow relative">
                      <h2
                        className={`text-2xl font-bold mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {novel.title}
                      </h2>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } absolute top-0 right-0`}
                      >
                        Author: {novel.author?.penName}
                      </p>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        } mb-4 line-clamp-2`}
                      >
                        {novel.description}
                      </p>

                      <div
                        className={`flex items-center text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center">
                          <FaHeart className="text-red-500 mr-2" />
                          <span>{novel.likes?.length || 0} Likes</span>
                        </div>
                        <span className="mx-4">•</span>
                        <div className="flex items-center">
                          <FaBookOpen className="text-blue-500 mr-2" />
                          <span>{novel.chapters?.length || 0} Chapters</span>
                        </div>
                        {novel.genre && (
                          <>
                            <span className="mx-4">•</span>
                            <div
                              className={`px-4 py-1.5 rounded-full text-sm ${
                                isDarkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {novel.genre}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Rankings;
