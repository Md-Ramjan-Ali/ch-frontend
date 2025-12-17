
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { data: userData, isLoading, isError } = useGetMeQuery({});
  const location = useLocation();

  const profile = userData?.data;

  const role = profile?.role;
  const email = profile?.email;
  // const subscriptionPlan = profile?.subscriptionPlan;
  // const trialAvailable = profile?.trialAvailable;

  //(role, email, subscriptionPlan, trialAvailable);

  // wait for data
  if (isLoading) return <p>Loading...</p>;

  // API failed (token expired or server error)
  if (isError) return <Navigate to="/login" replace />;

  // no role means not logged in
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // email not verified (if you really need this check)
  if (!email) {
    alert("Please verify your email address before accessing this page.");
    return <Navigate to="/signup" replace />;
  }

  // role does not match allowed roles
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;











// // src/components/Authentication/ProtectedRoute.tsx
// import { useGetMeQuery } from "@/redux/features/auth/authApi";
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// interface ProtectedRouteProps {
//   allowedRoles: string[];
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles,children }) => {
// const { data: userData } = useGetMeQuery({});
// const role = userData?.data?.role;
// const email = userData?.data?.email;
// const subscriptionPlan = userData?.data?.subscriptionPlan;
// const trialAvailable = userData?.data?.trialAvailable;

// //(role, email, subscriptionPlan, trialAvailable);


//   if (!role) {
//      return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!email) {
//      alert("Please verify your email address before accessing this page.");
//     return <Navigate to="/signup" replace />;
//   }

 

//   if (!allowedRoles.includes(role)) {
//      return <Navigate to="/unauthorized" replace />;
//   }

//    return children;
// };

// export default ProtectedRoute;








 