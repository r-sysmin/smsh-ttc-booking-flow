import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/auth-provider';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) {
    return <Navigate to="/auth?intent=signin" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
