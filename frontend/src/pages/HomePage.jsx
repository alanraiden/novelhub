import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import DisplayBooks from "../components/DisplayBooks";
import Interests from "../components/Interests";
import DarkModeContext from "../context/DarkModeContext";
import LoadingScreen from "../utils/LoadingScreen";
import Chatbot from "../components/Chatbot";
import Footer from "../utils/Footer";

function HomePage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-black/100" : "bg-white"}`}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 sm:py-6 lg:py-8">
              <Interests />
              <h1 
                className="flex justify-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center sm:text-left py-4 sm:py-6 lg:py-8 transition-colors duration-200"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Trending Novels
              </h1>
              <div className="w-full">
                <DisplayBooks />
              </div>
            </div>
          </main>
          <Footer />
          <Chatbot />
        </>
      )}
    </div>
  );
}

export default HomePage;
