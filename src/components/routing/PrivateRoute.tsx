import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import React from "react";

export default function PrivateRoute({ children }: { children: React.JSX.Element }) {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black">
                {/* Logo */}
                <img src="/images/logo/elev8-logo-icon.png" alt="Logo" className="w-16 h-16 mb-4 animate-bounce" />

                {/* Yükleniyor yazısı */}
                <p className="text-gray-700 dark:text-gray-200 text-lg animate-pulse">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}
