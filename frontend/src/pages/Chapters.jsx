import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaBookOpen } from 'react-icons/fa';
import DarkModeContext from '../context/DarkModeContext';
import LoadingScreen from '../utils/LoadingScreen';
import Cookies from 'js-cookie';
import Footer from '../utils/Footer';

const Chapters = () => {
    const { id } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isDarkMode } = useContext(DarkModeContext);
    const [hoveredChapter, setHoveredChapter] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${API_URL}/chapters/${id}/chapters`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChapters(response.data);
            } catch (err) {
                setError('Failed to fetch chapters');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, [id]);

    if (loading) return <LoadingScreen />;

    if (error) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${
                isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black text-white' : 'bg-gray-50 text-gray-900'
            }`}>
                <p className="text-xl font-medium text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gray-50'
        }`}>
            <Navbar />
            <div className="container mx-auto px-4 py-28">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-12"
                >
                    <FaBook className={`text-4xl ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`} />
                    <h2 className={`text-4xl font-extrabold ${
                        isDarkMode
                            ? 'bg-white'
                            : 'bg-black'
                    } bg-clip-text text-transparent`}>
                        Available Chapters
                    </h2>
                </motion.div>

                <AnimatePresence>
                    {chapters.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mx-auto"
                        >
                            {chapters.map((chapter) => (
                                <motion.div
                                    key={chapter._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onHoverStart={() => setHoveredChapter(chapter._id)}
                                    onHoverEnd={() => setHoveredChapter(null)}
                                    className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                                        isDarkMode
                                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                                            : 'bg-white hover:bg-gray-50'
                                    } shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <FaBookOpen className={`text-2xl ${
                                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                }`} />
                                                <Link to={`/novels/${id}/chapters/${chapter._id}`}>
                                                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                                                        isDarkMode
                                                            ? 'from-blue-400 to-blue-200'
                                                            : 'from-blue-600 to-blue-800'
                                                    } bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                                                        {chapter.chapterName}
                                                    </h3>
                                                </Link>
                                            </div>
                                        </div>
                                        
                                        <p className={`text-base leading-relaxed mb-6 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {chapter.chapterContent.slice(0, 150)}...
                                        </p>

                                        <Link
                                            to={`/novels/${id}/chapters/${chapter._id}`}
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
                                                transition-all duration-300 transform hover:-translate-y-0.5 
                                                bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900
                                                text-white shadow-lg hover:shadow-xl`}
                                        >
                                            <span>Read Chapter</span>
                                            <motion.div
                                                animate={{
                                                    x: hoveredChapter === chapter._id ? [0, 5, 0] : 0
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                →
                                            </motion.div>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-center py-12 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            <FaBook className="text-6xl mx-auto mb-4 opacity-50" />
                            <p className="text-xl font-medium">No chapters available yet</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer/>
        </div>
    );
};

export default Chapters;
