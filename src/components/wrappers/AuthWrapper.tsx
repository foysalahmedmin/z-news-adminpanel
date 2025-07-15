import Loading from "@/components/partials/Loading";
import useUser from "@/hooks/states/useUser";
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface PrivateRouteProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user?.isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
