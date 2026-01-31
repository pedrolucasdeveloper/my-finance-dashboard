import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = () => {
  const { user } = useAuth();

  // Se não houver usuário, manda para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};