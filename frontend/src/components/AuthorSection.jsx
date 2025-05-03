import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaStar, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

const AuthorSection = ({ novelsData, onUploadNovel }) => {
  const [showNovelForm, setShowNovelForm] = useState(false);
  const navigate = useNavigate();

  const handleNovelClick = (novelId) => {
    navigate(`/novel-analytics/${novelId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-pink-400 bg-clip-text text-transparent"
        >
          Your Published Novels
        </motion.h3>
        <button
          onClick={() => setShowNovelForm(true)}
          className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Upload Novel
        </button>
      </div>

      {novelsData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-inner"
        >
          <FaBook className="mx-auto text-4xl mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Start your journey as an author by uploading your first novel!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-12">
          {novelsData.map((novel, index) => (
            <motion.div
              key={novel._id}
              variants={cardVariants}
              onClick={() => handleNovelClick(novel._id)}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-gray-100/20 dark:border-gray-700/20 h-[480px] cursor-pointer"
            >
              <div className="relative h-[320px] overflow-hidden">
                <motion.img
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  src={novel.coverPhoto.url}
                  alt={novel.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <FaStar className="text-yellow-400" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white dark:from-gray-800 to-white/0 dark:to-gray-800/0">
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {novel.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {novel.description}
                </p>
                <div className="flex items-center justify-between text-sm mt-auto">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center space-x-1 text-blue-500 dark:text-blue-400"
                    >
                      <FaUsers />
                      <span>{novel.reviews?.length || 0}</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center space-x-1 text-yellow-500 dark:text-yellow-400"
                    >
                      <FaStar />
                      <span>
                        {novel.likes?.length || 0}
                      </span>
                    </motion.div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {formatDate(novel.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {showNovelForm && onUploadNovel && (
        <div
          onClick={() => setShowNovelForm(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          {onUploadNovel(showNovelForm, () => setShowNovelForm(false))}
        </div>
      )}
    </motion.div>
  );
};

export default AuthorSection;
