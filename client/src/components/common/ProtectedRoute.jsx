import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
