import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthState = (props) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [loggedUser, setLoggedUser] = useState({});
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = Cookies.get("token");

        if (token && token !== "") {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLoggedUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [API_URL, reload]);

  const update = async () => {
    setReload(!reload);
  };

  const isAuthenticated = useCallback(() => {
    const token = Cookies.get("token");
    if (token && token !== "") {
      try {
        const decoded = jwtDecode(token);
        const isValid = decoded && decoded.exp > Date.now() / 1000;
        
        // If token is about to expire (less than 5 minutes), remove it
        if (decoded.exp && decoded.exp - Date.now() / 1000 < 300) {
          handleLogout();
          return false;
        }
        
        return isValid;
      } catch (error) {
        console.error("Token validation error:", error);
        handleLogout();
        return false;
      }
    }
    return false;
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    setLoggedUser({});
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoggedUser({});
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ loggedUser, update, isAuthenticated, handleLogout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
