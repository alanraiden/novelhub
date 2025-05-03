import { useState, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import AuthContext from "../context/AuthContext";
import googleIcon from '../assets/google_icon.jpg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const GoogleSignIn = () => {
  const { update } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        const { data } = await axios.post(`${API_URL}/oauth/google-login`, {
          token: response.access_token
        });

        if (data.success) {
          Cookies.set('token', data.token, {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
          });
          
          Cookies.set('userId', data.userId);
          
          await update();
          toast.success('Successfully signed in with Google!');
          navigate('/home');
        } else {
          toast.error(data.msg || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error("Google login failed:", error);
        toast.error(error.response?.data?.msg || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      toast.error('Failed to connect to Google. Please try again.');
      setIsLoading(false);
    }
  });

  return (
    <button
        onClick={() => !isLoading && handleGoogleLogin()}
      disabled={isLoading}
        className='w-full flex items-center justify-center bg-white border border-black/40 rounded-md my-4 p-4 cursor-pointer disabled:opacity-50'
      >
        {isLoading ? (
          <span>Signing in...</span>
        ) : (
          <>
            <img src={googleIcon} className='h-6 mr-2' alt="Google Icon" />
            Sign in with Google
          </>
        )}
    </button>
  );
};

export default GoogleSignIn;
