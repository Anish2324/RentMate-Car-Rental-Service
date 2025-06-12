import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set) => ({
      authAdmin: null,
      username: null,
      isverified: false,

      // Loading states
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: false,
      isSubmitting: false,
      // isverified: false,

      // ✅ Admin Signup
     signup: async (data) => {
  set({ isSigningUp: true });

  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    phoneNo: data.phoneNo,
  };

  try {
    const res = await axiosInstance.post('/admin/signup', payload);
    const user = res.data.admin;

    // Construct full name from available fields
    const fullName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

    if (user?.email && fullName) {
      set({
        authAdmin: user,
        username: fullName,
        isverified: user.isverified, // <-- use backend value, should be false after signup
      });

      console.log('admin Authentication', user);
      toast.success(`🎉 Welcome, ${fullName}`);
    } else {
      throw new Error('Invalid signup response from server');
    }
  } catch (error) {
    console.error('❌ Signup Error:', error);
    toast.error(error?.response?.data?.message || 'Signup failed!');
  } finally {
    set({ isSigningUp: false });
  }
},
      // ✅ Admin Login
      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post('/admin/login', data);
          console.log('Login response:', res.data);
          const user = res.data.user;

          const fullName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

          if (user?.email && fullName) {
            set({
              authAdmin: user,
              username: fullName,
              isverified: user.isverified,
            });
            toast.success(`👋 Welcome back, ${fullName}`);
          } else {
            throw new Error('Invalid login response');
          }
        } catch (error) {
          console.error('❌ Login Error:', error);
          toast.error(error?.response?.data?.message || 'Login failed');
        } finally {
          set({ isLoggingIn: false });
        }
      },



      verify: async (data) => {
        set({ isSubmitting: true });
        try {
          const response = await axiosInstance.post("/admin/verifyemail", data);
          toast.success("Email verified successfully!");
          set({ isverified: true });
          return true; // indicate success
        } catch (error) {
          toast.error(error.response?.data?.message || "Verification failed");
          set({ isverified: false });
          return false; // indicate failure
        } finally {
          set({ isSubmitting: false });
        }
      },



      // ✅ Logout
      logout: async () => {
        try {
          await axiosInstance.post('/admin/logout');
          set({ authAdmin: null, username: null });
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('❌ Logout Error:', error);
          toast.error(error?.response?.data?.message || 'Logout failed');
        }
      },
    }),





    {
      name: 'admin-auth', // key in localStorage
      partialize: (state) => ({
        authAdmin: state.authAdmin,
        username: state.username,
        isverified: state.isverified,
      }),
    }
  )
);