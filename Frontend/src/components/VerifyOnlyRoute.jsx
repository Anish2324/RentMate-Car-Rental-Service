// filepath: c:\Users\bharg\Downloads\Rentmate\Rentmate\Frontend\src\components\VerifyOnlyRoute.jsx
import { useAuthStore } from '../store/useAdminstore';
import { Navigate } from 'react-router-dom';

const VerifyOnlyRoute = ({ children }) => {
  const authAdmin = useAuthStore((state) => state.authAdmin);
  const isverified = useAuthStore((state) => state.isverified);

  if (!authAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }
  if (isverified) {
    return <Navigate to="/addcar" replace />;
  }
  return children;
};

export default VerifyOnlyRoute;