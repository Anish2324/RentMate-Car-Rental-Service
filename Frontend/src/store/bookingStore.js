import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useBookingStore = create((set, get) => ({
  bookedCar: null,
  bookingResult: null,
  bookingLoading: false,
  bookingError: null,
  customerBookings: [],
  customerBookingsLoading: false,
  customerBookingsError: null,

  setBookedCar: (car) => {
    console.log('Setting booked car:', car);
    set({ bookedCar: car });
  },

  clearBookedCar: () => {
    console.log('Clearing booking state');
    set({
      bookedCar: null,
      bookingResult: null,
      bookingError: null,
      bookingLoading: false,
    });
  },

  bookCar: async ({ noOfDays, startingDate }) => {
    const { bookedCar } = get();

    console.log('Initiating booking with data:', {
      bookedCar,
      noOfDays,
      startingDate,
    });

    if (!bookedCar || !bookedCar.Reg_No) {
      console.error('Booking error: No car selected');
      set({ bookingError: 'No car selected for booking.' });
      return;
    }

    if (!noOfDays || !startingDate) {
      console.error('Booking error: Missing input values');
      set({ bookingError: 'Missing booking details.' });
      return;
    }

    set({ bookingLoading: true, bookingError: null, bookingResult: null });

    try {
      console.log(
        `Sending POST request to /book/add-days/${bookedCar.Reg_No}...`
      );

      const res = await axiosInstance.post(
        `/book/add-days/${bookedCar.Reg_No}`,
        {
          no_of_days: noOfDays,
          starting_date: startingDate,
        }
      );

      console.log('Booking successful:', res.data);
      set({ bookingResult: res.data.booking });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Booking failed. Please try again.';
      console.error('Booking request failed:', error);
      set({ bookingError: errorMsg });
    } finally {
      console.log('Booking loading set to false');
      set({ bookingLoading: false });
    }
  },

  // NEW: Fetch bookings for the logged-in customer
  fetchCustomerBookings: async () => {
    set({ customerBookingsLoading: true, customerBookingsError: null });
    try {
      const res = await axiosInstance.get('/book/customer-bookings');
      set({ customerBookings: res.data.bookings });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch bookings.';
      set({ customerBookingsError: errorMsg });
    } finally {
      set({ customerBookingsLoading: false });
    }
  },
}));