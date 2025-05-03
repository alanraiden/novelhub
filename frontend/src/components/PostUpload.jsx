import { useState, useContext } from "react";
import axios from "axios";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeContext from "../context/DarkModeContext";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const PostUpload = ({ onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);
  const token = Cookies.get("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file });
      // Create a preview URL for the selected image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    if (newPost.image) {
      formData.append("image", newPost.image);
    }
    try {
      await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setNewPost({ title: "", content: "", image: null });
      setImagePreview(null); // Reset preview after successful post
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post");
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
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
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
          className={`w-full max-w-2xl ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-white to-gray-50"
          } p-8 rounded-2xl shadow-2xl transform transition-all overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <FaCloudUploadAlt className={`text-2xl ${isDarkMode ? "text-blue-400" : "text-blue-800"}`} />
              <h2 className={`text-3xl font-extrabold bg-gradient-to-r ${
                isDarkMode
                  ? "from-white to-blue-400"
                  : "from-black to-blue-800"
              } bg-clip-text text-transparent`}>
                Create a New Post
              </h2>
            </motion.div>
            <button
              onClick={onClose}
              className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2"
            >
              <FaTimes className="text-lg" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmitPost} className="space-y-6">
            <div className="group">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Post Title
              </label>
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm`}>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      title: e.target.value,
                    })
                  }
                  className={`w-full p-4 pr-12 outline-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your post title"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Post Content
              </label>
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm`}>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      content: e.target.value,
                    })
                  }
                  className={`w-full p-4 min-h-[50px] outline-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Upload Image
              </label>
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm flex items-center justify-center p-6 cursor-pointer hover:bg-opacity-80 transition-all duration-300`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FaCloudUploadAlt className={`text-3xl ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Click to upload image</span>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="absolute top-2 right-2 h-12 w-12 object-cover border border-gray-300 rounded-md"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
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
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostUpload;
