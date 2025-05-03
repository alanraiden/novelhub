import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaBars, FaTimes, FaSun, FaMoon, FaHome, FaComments, FaSignOutAlt } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import AuthContext from "../context/AuthContext";
import DarkModeContext from "../context/DarkModeContext";
import Cookies from "js-cookie";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, update } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = async () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    update();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/novels/search`, {
          params: { query: searchQuery.trim() },
        });
        setSuggestions(response.data.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (novel) => {
    setSearchQuery(novel.title);
    setShowSuggestions(false);
    navigate(`/novels/${novel._id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 ${
        isDarkMode
          ? "bg-black/100 backdrop-blur-md shadow-lg border-b border-gray-800"
          : "bg-white/80 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4 px-4 gap-20">
          <Link
            to="/home"
            className={`flex items-center space-x-2 ${
              isDarkMode
                ? "text-white hover:text-white"
                : "text-black hover:text-black"
            } transition-colors duration-300`}
          >
            <span className="text-2xl font-bold flex items-center space-x-1">
              <span>Novel Hub</span>
              <img
                src={
                  isDarkMode
                    ? "/ink-logo-light.png"
                    : "/ink-logo-dark.png"
                }
                alt="Ink Logo"
                className="w-6 h-6"
              />
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-2xl"
          >
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search novels..."
                className={`w-full py-2.5 pl-12 pr-4 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-600/50 border-gray-800 text-white placeholder-gray-400 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50/50 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-200 transition-all duration-300`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              {/* Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim().length >= 2 && (
                <div
                  className={`absolute mt-2 w-full rounded-xl shadow-xl border overflow-hidden ${
                    isDarkMode
                      ? "bg-black/100 border-gray-800"
                      : "bg-white border-gray-100"
                  } max-h-96 overflow-y-auto z-50`}
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((novel) => (
                      <div
                        key={novel._id}
                        className={`flex items-center gap-4 p-3 cursor-pointer transition-all duration-300 ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSuggestionClick(novel)}
                      >
                        <img
                          src={novel.coverPhoto.url}
                          alt={novel.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-sm font-semibold truncate ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {novel.title}
                          </h3>
                          <p
                            className={`text-xs truncate mt-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {novel.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className={`p-4 text-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate("/rankings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-white bg-black/100 hover:bg-gray-800"
                  : "text-gray-700 bg-white/80 hover:bg-gray-100"
              }`}
            >
              <FaRankingStar className={"text-lg"} />
              <span>Rankings</span>
            </button>
            <button
              onClick={() => navigate("/forum")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-white bg-black/100 hover:bg-gray-800"
                  : "text-gray-700 bg-white/80 hover:bg-gray-100"
              }`}
            >
              <FaComments className="text-lg" />
              <span>Forum</span>
            </button>

            {isAuthenticated() && (
              <button
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "text-white bg-black/100 hover:bg-gray-800"
                    : "text-gray-700 bg-white/80 hover:bg-gray-100"
                }`}
              >
                <FaUser className="text-lg" />
                <span>Profile</span>
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-yellow-300 hover:bg-yellow-500/20"
                  : "text-gray-700 hover:bg-yellow-100"
              }`}
            >
              {isDarkMode ? (
                <FaSun className="text-lg" />
              ) : (
                <FaMoon className="text-lg" />
              )}
            </button>

            <button
              onClick={
                isAuthenticated() ? handleLogout : () => navigate("/login")
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500"
              } hover:text-white`}
            >
              <FaSignOutAlt className="text-lg" />
              <span>{isAuthenticated() ? "Logout" : "Login"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <FaTimes size={24} className="text-black dark:text-white" />
              ) : (
                <FaBars size={24} className="text-black dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            isDarkMode ? "bg-black" : "bg-white"
          } border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
        >
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search novels..."
                className={`w-full py-2 pl-10 pr-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-800 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="px-4 py-2 space-y-2">
            <Link
              to="/home"
              className="flex items-center space-x-2 p-2 rounded-lg text-black dark:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome className="text-black dark:text-white" />{" "}
              <span className="text-black dark:text-white">Home</span>
            </Link>
            <Link
              to="/rankings"
              className="flex items-center space-x-2 p-2 rounded-lg text-black dark:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaRankingStar className="text-black dark:text-white" />{" "}
              <span className="text-black dark:text-white">Rankings</span>
            </Link>
            <Link
              to="/forum"
              className="flex items-center space-x-2 p-2 rounded-lg text-black dark:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaComments className="text-black dark:text-white" />{" "}
              <span className="text-black dark:text-white">Forum</span>
            </Link>
            {isAuthenticated() && (
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-2 rounded-lg text-black dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUser className="text-black dark:text-white" />{" "}
                <span className="text-black dark:text-white">Profile</span>
              </Link>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-lg dark:text-white"
              >
                {isDarkMode ? (
                  <>
                    <FaSun className="text-yellow-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FaMoon />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                isAuthenticated() ? handleLogout() : navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FaSignOutAlt />
              <span>{isAuthenticated() ? "Logout" : "Login"}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
