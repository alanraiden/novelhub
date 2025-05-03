import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import DarkModeContext from "../context/DarkModeContext";
const API_URL = import.meta.env.VITE_API_URL;

const Chatbot = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Welcome to Novel Hub! I'm your personal assistant, Novik. How can I help you?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    { text: "📚 Browse Novels", query: "show me novels" },
    { text: "📖 Find Chapters", query: "help with chapters" },
    { text: "⭐ Write Review", query: "how to write review" },
    { text: "🎯 Get Recommendations", query: "recommend novels" },
    { text: "💬 Customer Support", query: "customer support" },
  ];

  const handleSuggestionClick = (query) => {
    setInputMessage(query);
    handleSubmit({ preventDefault: () => {} });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot/query`, {
        message: userMessage,
        isGuest: !isAuthenticated(),
      });

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: response.data.response },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-gradient-to-br from-[#01A8FF] via-[#0189FF] to-[#0165FF] text-white rounded-full p-1 shadow-lg w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out"
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <motion.svg
            className="w-8 h-8 relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </motion.svg>
        ) : (
          <motion.svg
            className="w-8 h-8 relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </motion.svg>
        )}
      </motion.button>

      {/* Chat Container */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute bottom-16 right-0 w-96 rounded-lg shadow-2xl overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-900 to-gray-800"
              : "bg-white"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#01A8FF] to-[#0165FF] p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Novik {!isAuthenticated() && <span className="text-xs">(Guest Mode)</span>}
            </h3>
          </div>

          {/* Messages */}
          <div className={`h-96 overflow-y-auto p-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.type === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`mb-4 flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 shadow-md ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-[#01A8FF] to-[#0165FF] text-white"
                      : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 shadow-md ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="flex gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    ></motion.div>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    ></motion.div>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div
            className={`p-4 border-t ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            } flex gap-2 overflow-x-auto`}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.query)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap shadow-md ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                {suggestion.text}
              </motion.button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 p-2 rounded-lg border shadow-md ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-[#01A8FF] to-[#0165FF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Send
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;