import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-white via-white to-gray-200 text-black dark:bg-gradient-to-br dark:from-black dark:via-black-800 dark:to-gray-900 dark:text-white relative">
      {/* <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div> */}
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-white dark:bg-clip-text dark:text-transparent transform hover:scale-105 transition-transform duration-300">
              Novel Hub
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">
              Your gateway to endless stories. Discover, read, and create captivating novels in our growing community.
            </p>
            <div className="flex space-x-5 dark:hidden">
              <a href="#" className="text-gray-400 hover:text-blue-500 transform hover:-translate-y-1 transition-all duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transform hover:-translate-y-1 transition-all duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transform hover:-translate-y-1 transition-all duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transform hover:-translate-y-1 transition-all duration-300">
                <FaDiscord size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
            </h3>
            <ul className="space-y-3 dark:hidden">
              <li>
                <Link to="/home" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Rankings</span>
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Community Forum</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Dashboard</span>
                </Link>
              </li>
            </ul>

            <ul className="space-y-3 hidden dark:block">
              <li>
                <Link to="/home" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Rankings</span>
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Community Forum</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div className="space-y-4 dark:hidden">
            <h3 className="text-xl font-semibold relative inline-block">
              Popular Genres
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Adventure', 'Horror'].map((genre) => (
                <span key={genre} className="text-gray-600 hover:text-blue-500 transition-colors duration-300 cursor-pointer transform hover:translate-x-1 hover:scale-105">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 hidden dark:block">
            <h3 className="text-xl font-semibold relative inline-block">
              Popular Genres
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Adventure', 'Horror'].map((genre) => (
                <span key={genre} className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer transform hover:translate-x-1 hover:scale-105">
                  {genre}
                </span>
              ))}
            </div>
          </div>

                   {/* Newsletter */}
         <div className="space-y-4">
            <h3 className="text-xl font-semibold relative inline-block">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-transparent"></span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest updates and featured stories.
            </p>
            <div className="flex flex-col space-y-2">
 {/*}             <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/50 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-3 rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98]">
                Subscribe
              </button>
*/}
            </div>
          </div>

        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-16 pt-8 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} Novel Hub. All rights reserved. Made with ❤️ by NK
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white text-sm transition-colors duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;