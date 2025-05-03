import { useState, useContext } from "react";
import axios from "axios";
import { FaTimes, FaCloudUploadAlt, FaYoutube, FaImage, FaVideo, FaExclamationCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeContext from "../context/DarkModeContext";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

const UploadNovel = ({ authorData, onNovelCreated, onClose }) => {
  const [newNovel, setNewNovel] = useState({
    title: "",
    description: "",
    coverPhoto: null,
    introVideo: "",
    videoType: "youtube", // 'youtube' or 'file'
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = Cookies.get("token");

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      setNewNovel({ ...newNovel, coverPhoto: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        setError("Video size should be less than 50MB");
        return;
      }
      setNewNovel({ ...newNovel, introVideo: file, videoType: "file" });
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleYouTubeURLChange = (e) => {
    const url = e.target.value;
    setNewNovel({ ...newNovel, introVideo: url, videoType: "youtube" });

    // Extract video ID for preview
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    if (videoId) {
      setVideoPreview(`https://www.youtube.com/embed/${videoId}`);
    } else {
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", newNovel.title);
      formData.append("description", newNovel.description);
      formData.append("authorId", authorData._id);

      if (newNovel.coverPhoto) {
        formData.append("coverPhoto", newNovel.coverPhoto);
      }

      if (newNovel.introVideo) {
        if (newNovel.videoType === "youtube") {
          const videoUrl = newNovel.introVideo.trim();
          let embedUrl;
          if (videoUrl.includes("youtube.com/watch?v=")) {
            embedUrl = videoUrl.replace(
              "youtube.com/watch?v=",
              "youtube.com/embed/"
            );
          } else if (videoUrl.includes("youtu.be/")) {
            const videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          } else {
            embedUrl = videoUrl;
          }
          formData.append("introVideo", embedUrl);
        } else {
          formData.append("introVideo", newNovel.introVideo);
        }
      }

      const response = await axios.post(`${API_URL}/novels`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      onNovelCreated(response.data);
      onClose();
    } catch (err) {
      console.error("Error uploading novel:", err);
      setError(err.response?.data?.msg || "Failed to upload novel");
      setTimeout(() => setError(""), 5000);
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
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
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
          className={`w-full max-w-4xl ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-white to-gray-50"
          } p-8 rounded-2xl shadow-2xl transform transition-all overflow-hidden relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="relative mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2"
              >
                <FaCloudUploadAlt
                  className={`text-2xl ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h2
                  className={`text-3xl font-extrabold bg-gradient-to-r ${
                    isDarkMode
                      ? "from-blue-400 to-purple-400"
                      : "from-blue-600 to-purple-600"
                  } bg-clip-text text-transparent`}
                >
                  Upload Your Novel
                </h2>
              </motion.div>
              <button
                onClick={onClose}
                className={`absolute top-0 right-0 p-2 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <FaTimes
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-2"
              >
                <FaExclamationCircle />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label
                      className={`block ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2 font-medium`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={newNovel.title}
                      onChange={(e) =>
                        setNewNovel({ ...newNovel, title: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl ${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-700 text-white"
                          : "bg-white border-gray-200"
                      } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your novel's title"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      className={`block ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2 font-medium`}
                    >
                      Description
                    </label>
                    <textarea
                      value={newNovel.description}
                      onChange={(e) =>
                        setNewNovel({
                          ...newNovel,
                          description: e.target.value,
                        })
                      }
                      className={`w-full p-3 rounded-xl ${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-700 text-white"
                          : "bg-white border-gray-200"
                      } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-64`}
                      placeholder="Write a compelling description for your novel"
                      required
                    />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label
                      className={`block ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2 font-medium`}
                    >
                      Cover Photo
                    </label>
                    <div
                      className={`relative rounded-xl ${
                        isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                      } p-4 border-2 border-dashed ${
                        isDarkMode ? "border-gray-700" : "border-gray-300"
                      } hover:border-blue-500 transition-colors cursor-pointer`}
                    >
                      <input
                        type="file"
                        onChange={handleCoverPhotoChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaImage
                          className={`text-3xl ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          } text-center`}
                        >
                          Drop your cover image here or click to browse
                          <br />
                          <span className="text-xs opacity-75">
                            (Max size: 5MB)
                          </span>
                        </span>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Uploaded preview"
                            className="absolute top-2 right-2 h-12 w-12 object-cover border border-gray-300 rounded-md"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } font-medium`}
                      >
                        Intro Video
                      </label>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Optional
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div
                        className={`relative ${
                          isDarkMode ? "bg-gray-800/50" : "bg-white"
                        } rounded-xl border ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300`}
                      >
                        <div className="absolute inset-y-0 left-3 flex items-center">
                          <FaYoutube className="text-red-500 text-xl" />
                        </div>
                        <input
                          type="text"
                          value={
                            newNovel.videoType === "youtube"
                              ? newNovel.introVideo
                              : ""
                          }
                          onChange={handleYouTubeURLChange}
                          className={`w-full pl-10 pr-3 py-3 ${
                            isDarkMode
                              ? "bg-transparent text-white"
                              : "bg-transparent"
                          } rounded-xl focus:outline-none`}
                          placeholder="Paste YouTube video URL"
                        />
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-1 h-px ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                        <span
                          className={`px-4 text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          OR
                        </span>
                        <div
                          className={`flex-1 h-px ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                      </div>

                      <div
                        className={`relative rounded-xl ${
                          isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                        } p-4 border-2 border-dashed ${
                          isDarkMode ? "border-gray-700" : "border-gray-300"
                        } hover:border-blue-500 transition-colors cursor-pointer`}
                      >
                        <input
                          type="file"
                          onChange={handleVideoChange}
                          accept="video/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FaVideo
                            className={`text-3xl ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            } text-center`}
                          >
                            Upload video file
                            <br />
                            <span className="text-xs opacity-75">
                              (Max size: 50MB)
                            </span>
                          </span>
                          {videoPreview && (
                            <>
                            {newNovel.videoType === "youtube" ? (
                              <iframe
                                src={videoPreview}
                                className="absolute top-2 right-2 h-12 w-12 object-cover border border-gray-300 rounded-md"
                                allowFullScreen
                                title="Video preview"
                              />
                            ) : (
                              <video
                                src={videoPreview}
                                className="absolute top-2 right-2 h-12 w-12 object-cover border border-gray-300 rounded-md"
                                controls
                              />
                            )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end gap-4 mt-8"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-2 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium
                    ${
                      isSubmitting
                        ? "opacity-75 cursor-not-allowed"
                        : "hover:shadow-lg transform hover:-translate-y-0.5"
                    }
                    transition-all duration-300`}
                >
                  {isSubmitting ? "Uploading..." : "Upload Novel"}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadNovel;
