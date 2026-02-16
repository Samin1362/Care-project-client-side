"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../providers/AuthProviders";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return children;
};

export default PrivateRoute;
