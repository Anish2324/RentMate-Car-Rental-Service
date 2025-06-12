import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCustomerAuthStore = create(
  persist(
    (set, get) => ({
      isCustomerVerified: false,
      isCustomerLoggingIn: false,
      isCustomerLoggedIn: false,
      customer: null,
      custAuth: null,
      isverify: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Signup handler
      signupCustomer: async (data) => {
        try {
          const res = await axiosInstance.post("/customer/signup", data);
          const token = res.data.customer;
          set({
            custAuth: token,
            customer: res.data.customer,
            isCustomerLoggedIn: true,
            isCustomerVerified: true,
            //isverify: true,
          });
          console.log("Signup successful. Token:", token);
          return res.data.customer;
        } catch (error) {
          console.error("Signup error:", error);
          set({ custAuth: null, isCustomerLoggedIn: false });
          toast.error(error?.response?.data?.message || "Signup failed");
          return null;
        }
      },

      // Email verification
      isCustomerSubmitting: false,
      verifyCustomerEmail: async (code) => {
        set({ isCustomerSubmitting: true });
        try {
          const res = await axiosInstance.post("/customer/verifyemail", code);
          toast.success(res.data.message || "Email verified!");
          // Fetch latest customer info
          const userRes = await axiosInstance.get("/customer/check");
          set({
            isCustomerVerified: true,
            customer: userRes.data.user || userRes.data.customer,
          });
          return true;
        } catch (err) {
          console.error("Email verification failed:", err);
          toast.error(err?.response?.data?.message || "Verification failed");
          return false;
        } finally {
          set({ isCustomerSubmitting: false });
        }
      },
      // Login handler
      loginCustomer: async (formData) => {
        set({ isCustomerLoggingIn: true });
        try {
          const res = await axiosInstance.post("/customer/login", formData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });
          const token = res.data.customer;
          set({
            custAuth: token,
            customer: res.data.customer,
            isCustomerLoggedIn: true,
            isCustomerLoggingIn: false,
            isCustomerVerified: res.data.customer?.isVerified, // <-- use isVerified
          });
          toast.success("Login successful!");
        } catch (err) {
          console.error("Login error:", err);
          toast.error(err?.response?.data?.message || "Login failed");
          set({
            custAuth: null,
            isCustomerLoggingIn: false,
            isCustomerLoggedIn: false,
          });
        }
      },
      // Logout handler
      logoutCustomer: async () => {
        try {
          await axiosInstance.post("/customer/logout");
          set({
            customer: null,
            isCustomerLoggedIn: false,
            // isCustomerVerified: false,
            custAuth: null,
          });
          toast.success("Logout successful!");
        } catch (err) {
          console.error("Logout error:", err);
          toast.error("Error during logout");
        }
      },

      // Check auth status on app load
      checkCustomerAuth: async () => {
        try {
          const res = await axiosInstance.get("/customer/check-auth");
          set({
            customer: res.data.user || res.data.customer,
            isCustomerLoggedIn: true,
            isCustomerVerified: (res.data.user || res.data.customer)
              ?.isVerified, // <-- use isVerified
          });
        } catch (err) {
          console.error("Customer not authenticated:", err);
          set({
            isCustomerLoggedIn: false,
            custAuth: null,
            customer: null,
            isCustomerVerified: false,
          });
        }
      },
    }),
    {
      name: "customer-auth",
      partialize: (state) => ({
        isCustomerVerified: state.isCustomerVerified,
        isCustomerLoggedIn: state.isCustomerLoggedIn,
        customer: state.customer,
        custAuth: state.custAuth,
        _hasHydrated: state._hasHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
