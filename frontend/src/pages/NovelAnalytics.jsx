import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaHeart, FaComments, FaChartLine, FaEdit, FaClock } from "react-icons/fa";
import DarkModeContext from "../context/DarkModeContext";
import Navbar from "../components/Navbar";
import Footer from "../utils/Footer";
import LoadingScreen from "../utils/LoadingScreen";

const API_URL = import.meta.env.VITE_API_URL;

const NovelAnalytics = () => {
  const { novelId } = useParams();
  const [novel, setNovel] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [newChapter, setNewChapter] = useState({
    chapterName: "",
    chapterContent: "",
  });
  const { isDarkMode } = useContext(DarkModeContext);
  const token = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchNovelDetails();
  }, [novelId]);

  const fetchNovelDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/novels/${novelId}`);
      setNovel(response.data);
    } catch (error) {
      console.error("Error fetching novel details:", error);
    }
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    if (!newChapter.chapterName || !newChapter.chapterContent) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/chapters/${novelId}/new-chapter`,
        newChapter,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchNovelDetails();
      setNewChapter({ chapterName: "", chapterContent: "" });
      // alert("Chapter added successfully!");
    } catch (error) {
      console.error("Error adding chapter:", error);
      alert("Failed to add chapter");
    }
  };

   if (isLoading) {
    return <LoadingScreen />;
  }
  
  const stats = [
    {
      icon: <FaBookOpen className="text-2xl text-blue-500" />,
      label: "Chapters",
      value: novel.chapters?.length || 0,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <FaHeart className="text-2xl text-red-500" />,
      label: "Likes",
      value: novel.likes?.length || 0,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: <FaComments className="text-2xl text-purple-500" />,
      label: "Reviews",
      value: novel.reviews?.length || 0,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <div
            className={`min-h-screen ${
              isDarkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-20 rounded-xl overflow-hidden shadow-xl mb-8 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90"
                        : "bg-gradient-to-r from-white/50 to-gray-200 opacity-90"
                    }`}
                  />
                  <div className="relative z-10 p-6 sm:p-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-48 h-72 md:w-64 md:h-96 flex-shrink-0"
                      >
                        <img
                          src={novel.coverPhoto.url}
                          alt={novel.title}
                          className="w-full h-full object-cover rounded-lg shadow-2xl"
                        />
                      </motion.div>

                      <div className="flex-1">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-4xl md:text-6xl font-bold ${
                            isDarkMode
                              ? "bg-gradient-to-r from-purple-400 to-blue-800 bg-clip-text text-transparent"
                              : "bg-gradient-to-r from-purple-800 to-black bg-clip-text text-transparent"
                          } mb-6 text-left`}
                        >
                          {novel.title}
                        </motion.h1>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={`text-sm md:text-base ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } space-y-4 text-left`}
                        >
                          {novel.description.split("\n").map(
                            (paragraph, index) =>
                              paragraph.trim() && (
                                <p key={index} className="leading-relaxed">
                                  {paragraph}
                                </p>
                              )
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 justify-center text-center">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${stat.bgColor} rounded-2xl p-6 ${
                            isDarkMode
                              ? "shadow-lg shadow-black/20"
                              : "shadow-lg"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                              {stat.icon}
                            </div>
                            <span
                              className={`text-3xl font-bold ${stat.textColor}`}
                            >
                              {stat.value}
                            </span>
                          </div>
                          <h3
                            className={`text-xl font-medium ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {stat.label}
                          </h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div
                className={`rounded-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900 to-black opacity-90"
                    : "bg-gradient-to-br from-white to-gray-200 opacity-90"
                } shadow-xl p-6 mb-8`}
              >
                <div className="flex space-x-4 mb-6">
                  {["overview", "chapters", "analytics"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === tab
                          ? `${
                              isDarkMode ? "bg-blue-500" : "bg-blue-600"
                            } text-white`
                          : `${
                              isDarkMode
                                ? "text-gray-300 hover:bg-gray-500"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "chapters" && (
                      <div className="space-y-6">
                        <div
                          className={`p-6 rounded-xl ${
                            isDarkMode ? "bg-gray-800/50" : "bg-gray-200"
                          }`}
                        >
                          <h3
                            className={`text-xl font-bold mb-4 ${
                              isDarkMode ? "text-gray-100" : "text-gray-700"
                            }`}
                          >
                            Add New Chapter
                          </h3>
                          <form
                            onSubmit={handleChapterSubmit}
                            className="space-y-4"
                          >
                            <div>
                              <label
                                className={`block text-sm font-medium ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                } mb-2`}
                              >
                                Chapter Title
                              </label>
                              <input
                                type="text"
                                value={newChapter.chapterName}
                                onChange={(e) =>
                                  setNewChapter({
                                    ...newChapter,
                                    chapterName: e.target.value,
                                  })
                                }
                                className={`w-full px-4 py-2 rounded-lg ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-white"
                                    : "bg-white border-gray-300"
                                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter chapter title"
                              />
                            </div>
                            <div>
                              <label
                                className={`block text-sm font-medium ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                } mb-2`}
                              >
                                Chapter Content
                              </label>
                              <textarea
                                value={newChapter.chapterContent}
                                onChange={(e) =>
                                  setNewChapter({
                                    ...newChapter,
                                    chapterContent: e.target.value,
                                  })
                                }
                                className={`w-full px-4 py-2 rounded-lg ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-white"
                                    : "bg-white border-gray-300"
                                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent h-56`}
                                placeholder="Write your chapter content here..."
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className={`px-6 py-2 rounded-lg ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-blue-500 to-red-500 hover:bg-gradient-to-r from-blue-800 to-red-800"
                                    : "bg-gradient-to-r from-blue-500 to-red-500 hover:bg-gradient-to-r from-blue-800 to-red-800"
                                } text-white font-medium transition-colors`}
                              >
                                Add Chapter
                              </button>
                            </div>
                          </form>
                        </div>

                        <div className="space-y-4">
                          {novel.chapters?.map((chapter, index) => (
                            <motion.div
                              key={chapter._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-xl ${
                                isDarkMode
                                  ? "bg-gray-700/50 hover:bg-gray-700"
                                  : "bg-white hover:bg-gray-50"
                              } transition-colors group`}
                              // onClick={() => navigate(`novels/${novelId}/chapters/${chapter._id}`)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <span
                                    className={`text-lg font-medium ${
                                      isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    Chapter {index + 1}:
                                  </span>
                                  <h4
                                    className={`text-lg font-semibold ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {chapter.chapterName}
                                  </h4>
                                </div>
                                {/* <FaChevronRight
                              className={`transform transition-transform ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } group-hover:translate-x-2`}
                            /> */}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "analytics" && (
                      <div className="space-y-6">
                        <div
                          className={`p-6 rounded-xl ${
                            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                          }`}
                        >
                          <h3
                            className={`text-xl font-bold mb-4 flex items-center ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <FaChartLine className="mr-2" />
                            Performance Metrics
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Add analytics charts and metrics here */}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div
                          className={`p-6 rounded-xl ${
                            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                          }`}
                        >
                          <h3
                            className={`text-xl font-bold mb-4 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Novel Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4
                                className={`text-sm font-medium ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                } mb-2`}
                              >
                                Created At
                              </h4>
                              <p
                                className={`text-lg font-medium flex items-center ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                <FaClock className="mr-2 text-blue-500" />
                                {new Date(novel.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <h4
                                className={`text-sm font-medium ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                } mb-2`}
                              >
                                Last Updated
                              </h4>
                              <p
                                className={`text-lg font-medium flex items-center ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                <FaEdit className="mr-2 text-green-500" />
                                {new Date(novel.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default NovelAnalytics;
