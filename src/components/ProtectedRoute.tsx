// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const auth = useAuth();
  
  // Le hook peut retourner null si le contexte n'est pas encore prêt
  if (!auth) return <div>Loading...</div>;
  const { user, loading } = auth;

  if (loading) {
    return <div>Loading authentication state...</div>;
  }

  const allowedRoles = ['admin', 'seller'];
  
  // Si l'utilisateur n'est pas connecté OU si son rôle n'est pas dans la liste autorisée
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Si tout est bon, on affiche le layout du dashboard
  return <Outlet />;
};

export default ProtectedRoute;