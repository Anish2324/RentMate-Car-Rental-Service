import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import Adminregister from './pages/Adminregister'
import AdminLogin from './pages/AdminLogin'
import Customerregister from './pages/Customerregister'
import CustomerLogin from './pages/Customerlogin'
import Viewcars from './pages/Viewcars'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAdminstore.js';
import AddCar from './pages/Addcar';
import Economy from './pages/economy.jsx';
import Suv from './pages/suv.jsx';
import Luxury from './pages/luxury.jsx';
import Sedan from './pages/sedan.jsx';
import Booking from './pages/Booking.jsx';
import Payment from './pages/Payment.jsx';
 import { useCustomerAuthStore } from './store/useCustomerAuthStore.js';
import Feedback from './pages/Viewfeed.jsx';
import ProtectedCustomerRoute from './components/ProtectedCustomerRoute.jsx';
import Booked from './pages/Booked.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import EmailVerificationForm from './pages/emailVerification.jsx';
import AdminCars from './pages/Admincars.jsx';
import EditCar from './pages/Editcar.jsx';
import Profile from './pages/Profile.jsx';
import VerifyOnlyRoute from './components/VerifyOnlyRoute.jsx';

const App = () => {
  const { authAdmin, isverified } = useAuthStore();
   const {isCustomerVerified ,custAuth, isCustomerLoggedIn, _hasHydrated } = useCustomerAuthStore();





  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
      
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/adminlogin" element={authAdmin?<AddCar /> : <AdminLogin />} /> */}

        {/* <Route path="/adminlogin" element={ !authAdmin ? ( <AdminLogin /> ) : isverified ? (<AddCar /> ) : (   <EmailVerificationForm /> )}/> */}
        <Route path="/adminlogin" element={!authAdmin ? <AdminLogin /> : isverified ? <AddCar /> : <EmailVerificationForm />} />
        <Route path="/verify" element={<EmailVerificationForm />} />

        {/* <Route path="/verify" element={<EmailVerificationForm />} /> */}
        {/* <Route path="/adminlogin" element={authAdmin && isverified ? <AddCar /> : <AdminLogin />} /> */}

        <Route path="/customerregister" element={<Customerregister />} />
       <Route path="/customerlogin" element={!custAuth ? <CustomerLogin /> : <Viewcars />} />

       <Route
  path="/profile"
  element={
    <ProtectedCustomerRoute>
      <Profile />
    </ProtectedCustomerRoute>
  }
/>
       
      <Route
  path="/viewcars"
  element={
    <ProtectedCustomerRoute>
      { <Viewcars />}
    </ProtectedCustomerRoute>
  }
/>


        <Route path="/Adminregister" element={<Adminregister />} />
        <Route path="/economy" element={<Economy />} />
        <Route path="/suv" element={<Suv />} />
        <Route path="/luxury" element={<Luxury />} />
        <Route path="/sedan" element={<Sedan />} />
        <Route path="/addcar" element={
          <ProtectedAdminRoute>
            <AddCar />
          </ProtectedAdminRoute>
        } />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/viewfeed/:regNo" element={<Feedback />} />
        <Route path="/booked" element={<Booked />} />
        {/* <Route path="/cars/:category" element={<CategoryCarsPage />} /> */}

        <Route path="/getcars" element={<AdminCars />} />
        <Route path="/editcar/:Reg_No" element={
          <ProtectedAdminRoute>
            <EditCar />
          </ProtectedAdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;