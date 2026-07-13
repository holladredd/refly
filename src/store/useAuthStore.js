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
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'An error occurred during login',
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
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'An error occurred during registration',
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
