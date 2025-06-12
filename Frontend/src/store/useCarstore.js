import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const useCarStore = create((set, get) => ({
  formData: {
    Reg_No: '',
    year: '',
    Car_company: '',
    Car_Model: '',
    rental_rate: '',
    availability: '',  // Will be string initially, parsed to boolean later
    fuel: '',
    seats: '',
    car_category: '',
    city: '',
    street: '',
    pincode: '',
  },
  imageFile: null,
  loading: false,

  setFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  setImageFile: (file) => set({ imageFile: file }),

  resetForm: () =>
    set({
      formData: {
        Reg_No: '',
        year: '',
        Car_company: '',
        Car_Model: '',
        rental_rate: '',
        availability: '',
        fuel: '',
        seats: '',
        car_category: '',
        city: '',
        street: '',
        pincode: '',
      },
      imageFile: null,
    }),

  setLoading: (loading) => set({ loading }),

  addCar: async () => {
    const { formData, imageFile } = get();
    set({ loading: true });
    toast.dismiss();

    // Validate form fields
    for (const key of Object.keys(formData)) {
      if (!formData[key]) {
        toast.error('All fields are required!');
        set({ loading: false });
        return false;
      }
    }

    if (!imageFile) {
      toast.error('Car image is required!');
      set({ loading: false });
      return false;
    }

    try {
      const base64Image = await toBase64(imageFile);

      const location = {
  city: formData.city,
  street: formData.street,
  pincode: Number(formData.pincode), // Ensure pincode is a number
};

      const payload = {
        Reg_No: formData.Reg_No,
        year: parseInt(formData.year),
        Car_company: formData.Car_company,
        Car_Model: formData.Car_Model,
        rental_rate: parseFloat(formData.rental_rate),
        availability: formData.availability === 'true' || formData.availability === true,
        fuel: formData.fuel,
        seats: parseInt(formData.seats),
        car_category: formData.car_category,
        location,
        image_url: base64Image,
      };

      await axiosInstance.post('/car/add-cars', payload, {
        withCredentials: true,
      });

      toast.success('Car added successfully!');
      get().resetForm();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add car');
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

// Helper to convert image to base64 string
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default useCarStore;
