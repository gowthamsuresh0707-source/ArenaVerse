import React from 'react';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
        <h2 className="text-2xl font-bold mb-4 text-accent neon-text">Access Denied</h2>
        <p className="mb-4">Please log in to view this page.</p>
        <a href="/login" className="px-6 py-2 bg-primary rounded-lg font-bold hover:opacity-90 transition">Go to Login</a>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
        <h2 className="text-2xl font-bold mb-4 text-accent neon-text">Unauthorized</h2>
        <p className="mb-4">You do not have access permissions for this section.</p>
        <a href="/" className="px-6 py-2 bg-primary rounded-lg font-bold hover:opacity-90 transition">Back Home</a>
      </div>
    );
  }

  return <>{children}</>;
};
