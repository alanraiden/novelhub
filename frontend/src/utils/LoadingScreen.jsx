import { useContext } from 'react';
import DarkModeContext from '../context/DarkModeContext';

const LoadingScreen = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-black/100' : 'bg-white'}`}>
      <div className="text-center">
        <div className="w-48 h-48">
          <iframe 
            src="https://lottie.host/embed/13e4b0f1-d456-4580-b1bc-f535559859c8/VGiblyIgX1.lottie"
            className="w-full h-full"
          ></iframe>
        </div>
        {/* <h2 className={`mt-4 text-2xl font-bold animate-pulse ${isDarkMode ? 'text-white' : 'text-black'} flex items-center justify-center`}>
          Novel Hub
        </h2>
        <p className={`mt-2 ${isDarkMode ? 'text-white/80' : 'text-black/80'} flex items-center justify-center`}>
          Loading your literary adventure...
        </p> */}
      </div>
    </div>
  );
};

export default LoadingScreen;
