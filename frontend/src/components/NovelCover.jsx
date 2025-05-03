import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import DarkModeContext from "../context/DarkModeContext";

const NovelCover = ({ novel, onLike, isLiked }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const handleLike = async () => {
    try {
      onLike();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleReadNowClick = () => {
    navigate(`/novels/${novel._id}/chapters`);
  };

  if (!novel) return null;

  return (
    <div
      className={`max-w-7xl mx-auto ${
        isDarkMode
          ? "bg-gradient-to-br from-black/100 to-gray-700"
          : "bg-gradient-to-br from-gray-50 to-white"
      } rounded-xl shadow-lg overflow-hidden transition-colors duration-300 backdrop-blur-sm`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Novel Cover and Basic Info */}
        <div className="lg:w-1/3 p-6">
          <div className="relative group">
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src={novel.coverPhoto.url}
              alt={novel.title}
              onError={(e) => {
                e.target.src = "/default-cover.jpg";
              }}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="mt-6 space-y-4">
            <button
              onClick={handleReadNowClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Read Now
            </button>
            <button
              onClick={handleLike}
              className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                isLiked
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  : isDarkMode
                  ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{novel.likes?.length || 0} Likes</span>
            </button>
          </div>
        </div>

        <div
          className={`lg:w-2/3 p-6 lg:border-l ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h1
            className={`text-4xl font-extrabold mb-6 leading-tight transition-colors duration-300 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-100 to-blue-600 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent"
            }`}
          >
            {novel.title}
          </h1>
          <div className="space-y-6">
            <p
              className={`text-xl font-medium flex items-center space-x-2 ${
                isDarkMode
                  ? "bg-gradient-to-r from-white to-blue-800 bg-clip-text text-transparent"
                  : "text-gray-800 hover:text-gray-900"
              } transition-colors duration-300`}
            >
              <span>Author:</span>
              <span className="italic">
                {novel.author?.penName || "Unknown Author"}
              </span>
            </p>
            <div>
              <h2
                className={`text-2xl font-extrabold mb-4 transition-colors duration-300 ${
                  isDarkMode ? "bg-gradient-to-r from-white to-blue-800 bg-clip-text text-transparent" : "text-gray-900"
                }`}
              >
                Description
              </h2>
              <p
                className={`text-base leading-relaxed whitespace-pre-line transition-transform duration-300 ${
                  isDarkMode
                    ? "text-gray-400 hover:translate-x-1"
                    : "text-gray-700 hover:translate-x-1"
                }`}
              >
                {novel.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {novel.introVideo && (
        <div className="p-8 border-t border-gray-500 border-opacity-50 mt-4 space-y-4">
          <h2
            className={`text-2xl font-extrabold mb-2 text-center ${
              isDarkMode
                ? "bg-gradient-to-r from-white to-blue-800 bg-clip-text text-transparent"
                : "text-gray-900"
            }`}
          >
            Introduction Video
          </h2>
          <div className="relative w-full lg:w-4/5 mx-auto overflow-hidden rounded-xl shadow-2xl">
            {novel.introVideo.url.includes("youtube.com") ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src={novel.introVideo.url}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                className="w-full rounded-lg"
                controls
                src={novel.introVideo.url}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NovelCover;
