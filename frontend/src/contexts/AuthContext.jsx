import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types'; // Step 1: Import PropTypes

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Your API base URL
  });

  // console.log(import.meta.env.VITE_BACKEND_URL); // Your API base URL);
  // Intercept requests to add the access token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercept responses to handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const setUserData = (userData) => {
    setUser(userData);
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/auth/login');
  };

  const isAuthenticated = async () => {
    try {
      const response = await api.get('/auth/protected');
      // console.log(response);
      setUser({ id: response.data.userId, userType: response.data.userType });
      return response.data.userType;
    } catch (error) {
      navigate('/auth/login');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      
      const response = await api.get('/auth/protected');
      setUser({ id: response.data.userId, userType: response.data.userType });

    } catch (error) {
      setUser(null);
      navigate('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    setUserData,
    logout,
    checkAuth,
    isAuthenticated,
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useProtectedRoute = (allowedRoles = ['user', 'admin']) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    } else if (!allowedRoles.includes(user.userType)) {
      navigate('/unauthorized');
    }
  }, [user, allowedRoles, navigate]);

  return user && allowedRoles.includes(user.userType);
};
