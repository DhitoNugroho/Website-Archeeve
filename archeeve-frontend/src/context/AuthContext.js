// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null); // Beri nilai awal null atau objek default

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // setUser dari useState adalah yang akan kita gunakan
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(true);

  console.log('[AuthContext] Initial state:', { token, user, loading });

  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      console.log('[AuthContext] useEffect for token change triggered. Current token:', token);
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (!user) { 
          console.log('[AuthContext] Token exists, user is not set. Attempting to fetch user profile...');
          await fetchUserProfile(); // fetchUserProfile akan memanggil setUser dan setLoading
        } else {
          console.log('[AuthContext] Token exists and user is already set. Skipping fetchUserProfile.');
          setLoading(false); 
        }
      } else {
        console.log('[AuthContext] No token found. Clearing user, auth header, and setting loading to false.');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setLoading(false);
      }
    };
    verifyTokenAndFetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Hanya bergantung pada token. fetchUserProfile di-memoize atau didefinisikan di luar jika perlu.

  // Fungsi fetchUserProfile sekarang akan menggunakan setUser dari scope AuthProvider
  const fetchUserProfile = async () => {
    console.log('[AuthContext] fetchUserProfile called.');
    // setLoading(true); // Sebaiknya setLoading(true) di awal proses yang memakan waktu
    try {
      const response = await api.get('/auth/user-profile');
      console.log('[AuthContext] fetchUserProfile - API Response:', response);
      const userDataFromProfile = response.data.data || response.data;
      
      if (userDataFromProfile && Object.keys(userDataFromProfile).length > 0) {
        console.log('[AuthContext] fetchUserProfile - User data received:', userDataFromProfile);
        setUser(userDataFromProfile); // Menggunakan setUser dari useState
      } else {
        console.warn('[AuthContext] fetchUserProfile - Received empty or invalid user data. Setting user to null.');
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user profile (token might be invalid/expired):', error.response?.data?.message || error.message);
      localStorage.removeItem('jwt_token');
      setToken(null); 
      setUser(null);
    } finally {
      console.log('[AuthContext] fetchUserProfile finished. Setting loading to false.');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('[AuthContext] login called with email:', email);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('[AuthContext] login - API Response:', response);
      const { access_token, user: userDataFromLogin } = response.data;

      if (!access_token || !userDataFromLogin) {
        console.error('[AuthContext] login - Invalid response from login API.');
        throw new Error('Invalid login response from server.');
      }
      
      const validUserData = userDataFromLogin.data || userDataFromLogin;

      if (!validUserData || Object.keys(validUserData).length === 0) {
          console.error('[AuthContext] login - User data from login API is empty or invalid.');
          throw new Error('User data from login is invalid.');
      }

      console.log('[AuthContext] login - Token and User data received:', { access_token, validUserData });
      localStorage.setItem('jwt_token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(validUserData); // Menggunakan setUser dari useState
      setToken(access_token);
      
      console.log('[AuthContext] login successful. User and Token set.');
      // setLoading(false) akan diurus oleh useEffect setelah token di-set
      return true;
    } catch (error) {
      console.error('[AuthContext] Login failed:', error.response ? error.response.data : error.message);
      localStorage.removeItem('jwt_token');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      setLoading(false);
      throw error; 
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    console.log('[AuthContext] register called for email:', email);
    try {
      const response = await api.post('/auth/register', { name, email, password, password_confirmation });
      console.log('[AuthContext] register - API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[AuthContext] Registration failed:', error.response ? error.response.data : error.message);
      throw error.response?.data || new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    console.log('[AuthContext] logout called.');
    try {
      if (token) { // Hanya panggil API logout jika ada token
        await api.post('/auth/logout'); // Tidak perlu menunggu setLoading di sini
        console.log('[AuthContext] Logout API call successful or skipped if no token.');
      }
    } catch (error) {
      console.error('[AuthContext] Logout API call failed (token might already be invalid):', error.response ? error.response.data : error.message);
    } finally {
      console.log('[AuthContext] Clearing client-side session for logout.');
      localStorage.removeItem('jwt_token');
      delete api.defaults.headers.common['Authorization'];
      setToken(null); 
      setUser(null); 
      // setLoading(false) akan dihandle oleh useEffect ketika token menjadi null
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user && user.role === 'admin';

  console.log('[AuthContext] Current context values:', { user, token, isAuthenticated, isAdmin, loading });

  // PERBAIKAN: Tambahkan 'setUser' ke objek value
  const contextValue = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    fetchUserProfile, // Jika Anda ingin memanggil ini dari luar context
    setUser // <-- TAMBAHKAN FUNGSI setUser DI SINI
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* {children} */}
      {/* Lebih baik menunggu loading selesai sebelum render children yang bergantung pada auth state */}
      {!loading ? children : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {/* Ganti dengan spinner atau UI loading yang lebih baik */}
            <p className="text-xl text-yellow-500">Loading Application...</p> 
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { // Atau periksa null jika nilai awal createContext adalah null
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
