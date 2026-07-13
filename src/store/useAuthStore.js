import { create } from 'zustand';
import api from '../context/api';
import Swal from 'sweetalert2';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  // Set user directly (e.g. from localStorage or initial fetch)
  setUser: (user) => set({ user, isLoading: false }),

  // Login action
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error("Login Error Details:", error);
      
      let errorMsg = 'An error occurred during login.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMsg = 'Network Error. This is usually caused by CORS (check if FRONTEND_URL matches your live UI domain exactly, without a trailing slash) or the backend server is down.';
      } else if (error.message) {
        errorMsg = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMsg,
      });
      return false;
    }
  },

  // Register action
  register: async (name, email, password) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post('/auth/register', { name, email, password });
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error("Registration Error Details:", error);

      let errorMsg = 'An error occurred during registration.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMsg = 'Network Error. This is usually caused by CORS issues or the backend server being unreachable.';
      } else if (error.message) {
        errorMsg = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMsg,
      });
      return false;
    }
  },

  // Logout action
  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Check auth status
  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
