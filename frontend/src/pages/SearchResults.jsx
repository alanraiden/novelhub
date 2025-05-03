import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import DarkModeContext from "../context/DarkModeContext";
import { FaBookOpen, FaHeart } from "react-icons/fa";
import Footer from "../utils/Footer";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const query = searchParams.get("q");

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
    const fetchResults = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;

        if (query && query.length >= 3) {
          const response = await axios.get(`${API_URL}/novels/search`, {
            params: { query },
          });
          setResults(response.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError("Failed to fetch search results");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-black/100" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <Navbar />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-black/100" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <Navbar />
        <div
          className={`text-center ${
            isDarkMode ? "text-red-400" : "text-red-500"
          }`}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-black/100" : "bg-gray-50"
        } flex flex-col items-center`}
      >
        <Navbar />
        <div className="container mx-auto px-4 py-28 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold mb-8 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Search Results for &quot;{query}&quot;
          </motion.h1>

          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-12 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p className="text-xl mb-3">No results found for your search.</p>
              <p
                className={`${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Try different keywords or check your spelling.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-[1300px] w-full mx-auto mt-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-24 px-4 sm:px-8">
                {results.map((novel) => (
                  <motion.div
                    key={novel._id}
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                    className={`${
                      isDarkMode
                        ? "bg-gradient-to-br from-black/50 to-gray-500 hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-600"
                        : "bg-gradient-to-br from-gray-200 to-white hover:bg-gradient-to-br hover:from-gray-300 hover:to-gray-100"
                    } rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 w-full max-w-[300px] mx-auto`}
                    onClick={() => navigate(`/novels/${novel._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={novel.coverPhoto.url}
                        alt={novel.title}
                        className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${
                          isDarkMode
                            ? "bg-gradient-to-t from-black/80 to-transparent"
                            : "bg-gradient-to-t from-black/50 to-transparent"
                        } h-20`}
                      ></div>
                    </div>
                    <div className="p-6">
                      <h2
                        className={`text-xl font-bold mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {novel.title}
                      </h2>
                      <p
                        className={`text-sm mb-4 line-clamp-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {novel.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center space-x-4 text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <div className="flex items-center">
                            <FaHeart className="text-red-500 mr-2" />
                            <span>{novel.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaBookOpen className="text-blue-500 mr-2" />
                            <span>{novel.chapters?.length || 0}</span>
                          </div>
                        </div>
                        {novel.genre && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDarkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {novel.genre}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
