import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { FaVolumeUp, FaVolumeMute, FaArrowLeft, FaArrowRight, FaBook, FaBookReader } from "react-icons/fa";
import DarkModeContext from "../context/DarkModeContext";
import LoadingScreen from "../utils/LoadingScreen";
import Cookies from 'js-cookie';
import Footer from "../utils/Footer";
const API_URL = import.meta.env.VITE_API_URL;

const ChapterDetail = () => {
  const { novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);
  const [showControls, setShowControls] = useState(true);
  let controlsTimeout;
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchChapterAndChaptersList = async () => {
      try {
        const chaptersResponse = await axios.get(
          `${API_URL}/chapters/${novelId}/chapters`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChapters(chaptersResponse.data);

        const chapterResponse = await axios.get(
          `${API_URL}/chapters/${novelId}/chapters/${chapterId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChapter(chapterResponse.data);
      } catch (err) {
        setError("Failed to fetch chapter");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterAndChaptersList();
    return () => {
      if (speechUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [novelId, chapterId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(controlsTimeout);
    };
  }, []);

  const handleTextToSpeech = () => {
    if (!chapter) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chapter.chapterContent);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((voice) => voice.lang.startsWith("en-"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechUtterance(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechUtterance(null);
      console.error("Speech synthesis error occurred");
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setSpeechUtterance(utterance);
  };

  if (loading) return <LoadingScreen />;
  
  if (error) return (
    <div className={`min-h-screen flex justify-center items-center ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="text-xl font-medium text-red-500">{error}</div>
    </div>
  );

  const currentChapterIndex = chapters.findIndex((ch) => ch._id === chapterId);
  const nextChapter = chapters[currentChapterIndex + 1];
  const prevChapter = chapters[currentChapterIndex - 1];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gray-50'
    }`}>
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg'
              : 'bg-white'
          }`}
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <FaBookReader className={`text-3xl ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`} />
                <h1 className={`text-4xl font-extrabold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {chapter.chapterName}
                </h1>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTextToSpeech}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isSpeaking
                    ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
                } text-white shadow-lg hover:shadow-xl`}
              >
                {isSpeaking ? (
                  <>
                    <FaVolumeMute className="text-xl" />
                    <span>Stop Reading</span>
                  </>
                ) : (
                  <>
                    <FaVolumeUp className="text-xl" />
                    <span>Read Aloud</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className={`prose max-w-none ${
              isDarkMode ? 'prose-invert' : ''
            }`}>
              <p className={`text-lg leading-relaxed whitespace-pre-wrap text-left ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {chapter.chapterContent}
              </p>
            </div>

            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`
                    fixed z-50 inset-x-0 bottom-4 mx-auto w-fit flex flex-wrap items-center justify-center gap-2 p-3 sm:p-4 rounded-xl shadow-xl backdrop-blur-lg
                    ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/70'}
                  `}
                >
                  {prevChapter ? (
                    <Link
                      to={`/novels/${novelId}/chapters/${prevChapter._id}`}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium 
                        transition-all duration-300 transform hover:-translate-y-0.5 
                        bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900
                        text-white shadow-lg hover:shadow-xl`}
                    >
                      <FaArrowLeft className="text-sm sm:text-base" />
                      <span>Previous</span>
                    </Link>
                  ) : (
                    <span className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base
                      ${isDarkMode ? 'text-gray-400 bg-gray-800/50' : 'text-gray-500 bg-gray-100/50'}`}
                    >
                      <FaArrowLeft className="text-sm sm:text-base opacity-50" />
                      <span>First</span>
                    </span>
                  )}

                  <Link
                    to={`/novels/${novelId}`}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium 
                      transition-all duration-300 transform hover:-translate-y-0.5 
                      ${isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      } shadow-lg hover:shadow-xl`}
                  >
                    <FaBook className="text-sm sm:text-base" />
                    <span>Overview</span>
                  </Link>

                  {nextChapter ? (
                    <Link
                      to={`/novels/${novelId}/chapters/${nextChapter._id}`}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium 
                        transition-all duration-300 transform hover:-translate-y-0.5 
                        bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900
                        text-white shadow-lg hover:shadow-xl`}
                    >
                      <span>Next</span>
                      <FaArrowRight className="text-sm sm:text-base" />
                    </Link>
                  ) : (
                    <span className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base
                      ${isDarkMode ? 'text-gray-400 bg-gray-800/50' : 'text-gray-500 bg-gray-100/50'}`}
                    >
                      <span>Last</span>
                      <FaArrowRight className="text-sm sm:text-base opacity-50" />
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      <Footer/>
    </div>
  );
};

export default ChapterDetail;
