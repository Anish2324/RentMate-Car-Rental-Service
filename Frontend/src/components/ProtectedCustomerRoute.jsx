import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';

const ProtectedCustomerRoute = ({ children }) => {
  const isCustomerLoggedIn = useCustomerAuthStore((state) => state.isCustomerLoggedIn);
  const isCustomerVerified = useCustomerAuthStore((state) => state.isCustomerVerified);

  if (!isCustomerLoggedIn) {
    return <Navigate to="/customerlogin" replace />;
  }
  if (!isCustomerVerified) {
    return <Navigate to="/verify?type=customer" replace />;
  }
  return children;
};

export default ProtectedCustomerRoute;