import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import ApplyAuthorship from "../components/ApplyAuthorship";
import UploadNovel from "../components/UploadNovel";
import UserPosts from "../components/UserPosts";
import AuthorSection from "../components/AuthorSection";
import { FaBook, FaComments, FaHeart, FaUserEdit, FaChevronRight } from "react-icons/fa";
import LikedNovels from "../components/LikedNovels";
import { motion } from "framer-motion";
import DarkModeContext from "../context/DarkModeContext";
import AuthContext from "../context/AuthContext";
import LoadingScreen from "../utils/LoadingScreen";
import Footer from "../utils/Footer";

const API_URL = import.meta.env.VITE_API_URL;
const token = Cookies.get("token");

const fetchAuthorData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/authors/author-dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching author data:", error);
    return null;
  }
};

const fetchUserPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/user-posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const fetchNovelData = async (novel) => {
  try {
    const response = await axios.get(`${API_URL}/novels/${novel._id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching novel with ID: ${novel._id}`, error);
    return null;
  }
};

const fetchUserLikedNovels = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/liked-novels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching liked novels:", error);
    return [];
  }
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedNovels, setLikedNovels] = useState([]);
  const [novelsData, setNovelsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorshipRequested, setAuthorshipRequested] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { isDarkMode } = useContext(DarkModeContext);
  const { loggedUser, update } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loggedUser && Object.keys(loggedUser).length > 0) {
          setUserData(loggedUser);

          const userPosts = await fetchUserPosts();
          setPosts(userPosts);
          
          const userLikedNovels = await fetchUserLikedNovels();
          setLikedNovels(userLikedNovels);

          if (loggedUser.role === "author") {
            const author = await fetchAuthorData();
            if (author) {
              setAuthorData(author);
              const novelPromises = author.novels.map((novel) =>
                fetchNovelData(novel)
              );
              const novels = await Promise.all(novelPromises);
              setNovelsData(novels.filter((novel) => novel !== null));
            }
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [loggedUser]);

  const handleAuthorshipRequest = async () => {
    setAuthorshipRequested(true);
    update();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return <div className="text-red-600 text-center p-8">Error: {error}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-4 py-8 space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className={`${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-1000 to-blackgray-900"
                  : "bg-white"
              } mt-20 backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-100/50"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-4xl font-bold ${
                      isDarkMode
                        ? "bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent"
                        : "bg-gradient-to-r from-black to-blue-800 bg-clip-text text-transparent"
                    } mb-5`}
                  >
                    Welcome back, {userData?.name}! 👋
                  </motion.h1>
                  <p
                    className={`mt-5 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Here&apos;s what&apos;s happening with your account today.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-6 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300 ${
                      (userData?.role || "").includes("author")
                        ? isDarkMode
                          ? "bg-purple-900 text-purple-200"
                          : "bg-purple-100 text-purple-700 border border-purple-200"
                        : isDarkMode
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {(userData?.role || "").charAt(0).toUpperCase() +
                      (userData?.role || "").slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className={`${
                    isDarkMode
                      ? "bg-blue-900"
                      : "bg-gradient-to-br from-blue-50 to-blue-100"
                  } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDarkMode ? "border-blue-800" : "border border-blue-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 ${
                        isDarkMode ? "bg-blue-700" : "bg-blue-500"
                      } rounded-lg text-white`}
                    >
                      <FaBook className="text-2xl" />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-blue-200" : "text-gray-600"
                        } font-medium`}
                      >
                        Total Novels
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {userData?.role === "author" ? novelsData.length : 0}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className={`${
                    isDarkMode
                      ? "bg-purple-900"
                      : "bg-gradient-to-br from-purple-50 to-purple-100"
                  } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDarkMode
                      ? "border-purple-800"
                      : "border border-purple-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 ${
                        isDarkMode ? "bg-purple-700" : "bg-purple-500"
                      } rounded-lg text-white`}
                    >
                      <FaComments className="text-2xl" />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-purple-200" : "text-gray-600"
                        } font-medium`}
                      >
                        Posts
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {posts.length}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className={`${
                    isDarkMode
                      ? "bg-pink-900"
                      : "bg-gradient-to-br from-pink-50 to-pink-100"
                  } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDarkMode ? "border-pink-800" : "border border-pink-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 ${
                        isDarkMode ? "bg-pink-700" : "bg-pink-500"
                      } rounded-lg text-white`}
                    >
                      <FaHeart className="text-2xl" />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-pink-200" : "text-gray-600"
                        } font-medium`}
                      >
                        Liked Novels
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {userData?.likedNovels
                          ? userData.likedNovels.length
                          : 0}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className={`${
                    isDarkMode
                      ? "bg-green-900"
                      : "bg-gradient-to-br from-green-50 to-green-100"
                  } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDarkMode
                      ? "border-green-800"
                      : "border border-green-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 ${
                        isDarkMode ? "bg-green-700" : "bg-green-500"
                      } rounded-lg text-white`}
                    >
                      <FaUserEdit className="text-2xl" />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-green-200" : "text-gray-600"
                        } font-medium`}
                      >
                        Role Status
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {userData?.role === "author" ? "Active" : "User"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {userData?.role === "user" && !authorshipRequested && (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowAuthorForm(true)}
                  className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Apply for Authorship</span>
                  <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "posts"
                    ? "bg-blue-500 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Posts
              </button>
              {userData?.role === "author" && (
                <button
                  onClick={() => setActiveTab("novels")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "novels"
                      ? "bg-blue-500 text-white shadow-md"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Your Novels
                </button>
              )}
              <button
                onClick={() => setActiveTab("liked")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "liked"
                    ? "bg-blue-500 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Liked Novels
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              {activeTab === "novels" && (
                <div className="mt-8">
                  <AuthorSection
                    authorData={authorData}
                    novelsData={novelsData}
                    onUploadNovel={(show, onClose) => (
                      <UploadNovel
                        authorData={authorData}
                        onNovelCreated={(newNovel) => {
                          setNovelsData([...novelsData, newNovel]);
                          onClose();
                        }}
                        onClose={onClose}
                      />
                    )}
                  />
                </div>
              )}

              {activeTab === "posts" && (
                <div className="space-y-8">
                  <UserPosts posts={posts} />
                </div>
              )}

              {activeTab === "liked" && (
                <div className="space-y-8">
                  <LikedNovels likedNovels={likedNovels} />
                </div>
              )}
            </motion.div>

            {showAuthorForm && (
              <ApplyAuthorship
                onRequest={handleAuthorshipRequest}
                onClose={() => setShowAuthorForm(false)}
              />
            )}
          </motion.div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Dashboard;
