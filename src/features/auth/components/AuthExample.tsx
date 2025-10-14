import React from "react";
import { useAuth } from "@/features/auth";

/**
 * Example component showing how to use the auth system
 */
export const AuthExample: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in using the profile icon in the header</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="text-lg font-semibold mb-4">Welcome, {user?.name}!</h2>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Phone:</strong> {user?.phone}
        </p>
        <p>
          <strong>Language:</strong> {user?.language}
        </p>
        <p>
          <strong>Verified:</strong> {user?.phone_verified_at ? "Yes" : "No"}
        </p>
      </div>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};
