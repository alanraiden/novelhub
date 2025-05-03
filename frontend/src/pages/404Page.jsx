import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DarkModeContext from '../context/DarkModeContext';

const NotFoundPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(255, 215, 0, 0.3)',
        '0 0 60px rgba(255, 215, 0, 0.3)',
        '0 0 20px rgba(255, 215, 0, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-white via-gray-100 to-white'} overflow-hidden`}>
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-blue-500'}`}
              style={{
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="mb-8"
          >
            <iframe 
              // src="https://lottie.host/embed/8f876bd2-0e1e-4e15-a243-e0c91aa28a10/kJm77a64xc.lottie" 
              src="https://lottie.host/embed/a6f4e279-3e7e-47cd-abd2-da043fab0919/TSCf9gH18W.lottie"
              className="w-[300px] h-[300px] md:w-[600px] md:h-[300px]" 
              seamless="seamless"
            ></iframe>
          </motion.div>

          <motion.p
            className={`text-xl md:text-3xl font-semibold mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </motion.p>

          <motion.button
            onClick={() => navigate('/')}
            className={`relative px-8 py-3 rounded-full text-lg font-bold text-white overflow-hidden group`}
            variants={glowVariants}
            animate="animate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:via-blue-700 group-hover:to-purple-600 transition-all duration-300"></span>
            <span className="relative">Return to Homepage</span>
          </motion.button>
        </motion.div>

        {/* Additional Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-500/5 to-transparent"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
