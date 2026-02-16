"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../providers/AuthProviders";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { isAdmin, adminLoading } = useAdmin();
  const router = useRouter();

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="animate-scale-in text-center">
          <p className="text-6xl">🔒</p>
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="mt-2 text-muted-foreground">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
