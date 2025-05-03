import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import coverImage from "../assets/login_signup_cover1.webp";
import GoogleSignIn from "../utils/GoogleSignIn";
import "../styles/SignUp.css";
import DarkModeContext from "../context/DarkModeContext";
import LoadingScreen from "../utils/LoadingScreen";

const SignupPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    setLoading(true);
    setError("");

    if (/\d/.test(name)) {
      setError("Name cannot contain numbers...");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainPattern = /^[^\d@]+$/;

    if (
      !emailPattern.test(email) ||
      /^\d+$/.test(email) ||
      !domainPattern.test(email.split("@")[1])
    ) {
      setError("Invalid email format...");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"w-full h-screen flex flex-col md:flex-row pt-0"}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="relative w-full md:w-3/5 h-1/2 md:h-full overflow-hidden">
            <img
              src={coverImage}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-700 ease-in-out hover:scale-110"
              alt="Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 z-10"></div>
            <div
              className="absolute top-[40%] left-1/4 z-20 flex flex-col text-white p-4 rounded-lg max-w-xs md:max-w-lg"
              style={{
                animation: "fadeInUp 1.2s ease-in-out forwards",
              }}
            >
              <h1
                className="text-2xl md:text-3xl font-bold mb-2 tracking-wider text-center md:text-left"
                style={{
                  animation: "textGlow 1.5s ease-in-out infinite alternate",
                }}
              >
                From Pages to Possibilities...
              </h1>
              <p
                className="text-base md:text-2xl font-normal text-center md:text-left"
                style={{
                  animation: "fadeIn 1.6s ease-in forwards",
                }}
              >
                Start Creating Today and Become Part of Our Expanding Family.
              </p>
            </div>
          </div>

          <div
            className={`w-full md:w-2/5 h-auto md:h-full ${
              isDarkMode
                ? "bg-gradient-to-r from-black to-gray-800 to-black"
                : "bg-[#f5f5f5]"
            } flex flex-col p-6 md:p-10 justify-center items-center`}
          >
            <h1
              className={`flex items-center space-x-2 text-2xl md:text-3xl ${
                isDarkMode ? "text-white" : "text-[#060606]"
              } font-semibold mb-1 mt-10`}
            >
              <span>Novel Hub</span>
              <img
                src={isDarkMode ? "/ink-logo-light.png" : "/ink-logo-dark.png"}
                alt="Ink Logo"
                className="w-6 h-6"
              />
            </h1>
            <h3
              className={`text-lg md:text-xl mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Sign Up
            </h3>

            <form
              className="w-full max-w-[400px] flex flex-col"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Name"
                className={`w-full py-2 my-2 bg-transparent border-b ${
                  isDarkMode
                    ? "text-white border-gray-600 placeholder-gray-400"
                    : "text-black border-black placeholder-gray-600"
                } outline-none focus:outline-none`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className={`w-full py-2 my-2 bg-transparent border-b ${
                  isDarkMode
                    ? "text-white border-gray-600 placeholder-gray-400"
                    : "text-black border-black placeholder-gray-600"
                } outline-none focus:outline-none`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className={`w-full py-2 my-2 bg-transparent border-b ${
                  isDarkMode
                    ? "text-white border-gray-600 placeholder-gray-400"
                    : "text-black border-black placeholder-gray-600"
                } outline-none focus:outline-none`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="w-full flex flex-col my-4">
                <button
                  type="submit"
                  className={`w-full text-white my-2 font-semibold ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-[#060606] hover:bg-gray-800"
                  } rounded-md p-4 text-center flex items-center justify-center transition-colors duration-300`}
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>

                <button
                  type="button"
                  className={`w-full my-2 font-semibold ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                      : "bg-white text-[#060606] border-black/40 hover:bg-gray-50"
                  } border rounded-md p-4 text-center flex items-center justify-center transition-colors duration-300`}
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>

              <div className="w-full flex items-center justify-center relative py-2">
                <div
                  className={`w-full h-[1px] ${
                    isDarkMode ? "bg-gray-700" : "bg-black/40"
                  }`}
                ></div>
                <p
                  className={`text-lg absolute ${
                    isDarkMode
                      ? "text-gray-400 bg-gray-900"
                      : "text-black/80 bg-[#f5f5f5]"
                  } px-2`}
                >
                  or
                </p>
              </div>

              <GoogleSignIn />
            </form>

            <div className="w-full flex items-center justify-center mt-6">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-[#060606]"
                }`}
              >
                Already have an account?{" "}
                <span
                  className={`font-semibold underline cursor-pointer ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupPage;
