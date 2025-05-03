import { useState, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFeatherAlt, FaBookOpen, FaPen } from "react-icons/fa";
import DarkModeContext from "../context/DarkModeContext";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const ApplyAuthorship = ({ onRequest, onClose }) => {
  const [authorFormData, setAuthorFormData] = useState({
    penName: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);
  const token = Cookies.get("token");

  const handleAuthorFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/authors/applyAuthorship`,
        {
          penName: authorFormData.penName,
          bio: authorFormData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRequest();
      onClose();
    } catch (error) {
      console.error("Error requesting authorship:", error);
      setError("Failed to submit authorship request");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`max-w-md w-full ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-white to-gray-50"
          } rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className={`relative p-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <motion.button
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className={`absolute right-6 top-6 p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } transition-all`}
            >
              <FaTimes />
            </motion.button>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${
                isDarkMode
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-blue-50 text-blue-500"
              }`}>
                <FaFeatherAlt className="text-xl" />
              </div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Become an Author
              </h2>
            </div>
            <p className={`mt-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Join our community of writers and share your stories with the world
            </p>
          </div>

          {/* Form */}
          <div className="p-6 pt-0">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isDarkMode
                    ? "bg-red-900/20 text-red-400 border border-red-800"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleAuthorFormSubmit} className="space-y-6">
              <div>
                <label className={`block font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="flex items-center space-x-2">
                    <FaPen className="text-sm" />
                    <span>Pen Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={authorFormData.penName}
                  onChange={(e) =>
                    setAuthorFormData({
                      ...authorFormData,
                      penName: e.target.value,
                    })
                  }
                  className={`w-full p-3 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } border focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Enter your pen name"
                  required
                />
              </div>

              <div>
                <label className={`block font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="flex items-center space-x-2">
                    <FaBookOpen className="text-sm" />
                    <span>Bio</span>
                  </div>
                </label>
                <textarea
                  value={authorFormData.bio}
                  onChange={(e) =>
                    setAuthorFormData({ ...authorFormData, bio: e.target.value })
                  }
                  className={`w-full p-3 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } border focus:ring-2 focus:ring-blue-500/20 h-32`}
                  placeholder="Tell us about yourself and your writing journey..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition-all`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`px-6 py-2 rounded-xl font-medium ${
                    isDarkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  } text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300`}
                >
                  Submit Application
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplyAuthorship;
