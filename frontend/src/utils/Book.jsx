import { Link } from "react-router-dom";
import { useContext } from "react";
import DarkModeContext from "../context/DarkModeContext";

const Book = ({ _id, title, description, coverPhoto }) => {
  const NOVEL_COVERS_PATH = import.meta.env.VITE_API_NOVELCOVERS_URL;
  const imageUrl = coverPhoto
    ? coverPhoto.url
    : "/default-cover.jpg";
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Link
      to={`/novels/${_id}`}
      className={
        `block ${isDarkMode ? "bg-black/100" : "bg-white"} rounded-xl overflow-hidden max-w-xs w-52 m-2 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2hover:rotate-1
        ${
          isDarkMode
            ? "shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20"
            : "shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20"
        } relative before:absolute before:inset-0 before:z-[-1] before:transition-all before:duration-500
        ${
          isDarkMode
            ? "before:bg-gradient-to-r before:from-black/100 before:to-gray-700"
            : "before:bg-gradient-to-r before:from-gray-300 before:to-white"
        }
        hover:before:scale-105
        hover:before:opacity-75
      `}
    >
      <div className="flex flex-col h-full relative z-10">
        <div className="relative overflow-hidden">
          <img
            className="w-full h-72 object-cover transition-transform duration-500 hover:scale-110"
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.target.src = "/default-cover.jpg";
            }}
          />
          <div
            className={`absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100
            ${
              isDarkMode
                ? "bg-gradient-to-t from-gray-900/80 to-transparent"
                : "bg-gradient-to-t from-black/30 to-transparent"
            }
          `}
          />
        </div>
        <div className="p-4 flex-grow backdrop-blur-sm">
          <h2
            className={`text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem] transition-colors duration-300
              ${
                isDarkMode
                  ? "text-white hover:text-yellow-300"
                  : "text-gray-800 hover:text-blue-600"
              }
            `}
          >
            {title}
          </h2>
          <p
            className={`text-sm line-clamp-3 transition-colors duration-300
              ${
                isDarkMode
                  ? "text-gray-300 hover:text-gray-100"
                  : "text-gray-600 hover:text-gray-800"
              }
            `}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Book;
