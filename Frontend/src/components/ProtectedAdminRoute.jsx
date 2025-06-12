import { useAuthStore } from '../store/useAdminstore';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const authAdmin = useAuthStore((state) => state.authAdmin);
  const isverified = useAuthStore((state) => state.isverified);

  if (!authAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }
  if (!isverified) {
    return <Navigate to="/verify" replace />;
  }
  return children;
};

export default ProtectedAdminRoute;