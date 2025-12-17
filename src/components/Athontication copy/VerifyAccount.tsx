/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
 import toast from "react-hot-toast";
import { useVerifyResetCodeMutation } from "@/redux/features/auth/authApi";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
//(token)
  const [verifyAccount, { isLoading }] = useVerifyResetCodeMutation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        navigate("/signup");
        return;
      }
      
      try {
        const res = await verifyAccount({ token}).unwrap();
        
        localStorage.setItem("role", res?.data?.role || "");
        localStorage.setItem("email", res?.data?.email || "");
        
        // alert("✅ Your account has been verified!");
         toast.success("✅ Your account has been verified!");
        setTimeout(() => navigate("/login"), 1000);
      } catch (err: any) {
        console.error("Verification failed:", err);
        // alert("❌ Verification failed or expired. Please sign up again.");
        toast.success("❌ Verification failed or expired. Please sign up again");
        navigate("/signup");
      }
    };
    
    verify();
  }, [token, verifyAccount, navigate]);
  
  return <div className="text-center mt-10">{isLoading ? "Verifying..." : "Redirecting..."}</div>;
};

export default VerifyAccount;









// import { useEffect } from "react";
// import { useNavigate,  useSearchParams } from "react-router-dom";
// import { useVerifyAccountMutation } from "@/redux/features/auth/authApi";
// import Cookies from "js-cookie";
// // import { jwtDecode } from "jwt-decode";
// const VerifyAccount = () => {
//   const [searchParams] = useSearchParams();
// const token = searchParams.get("token");
//   //(token)
//   const [verifyAccount, { isLoading }] = useVerifyAccountMutation({});
//   const navigate = useNavigate()
//   useEffect(() => {
//     const verify = async () => {
//       //(token,"Token Inside Verify")
//       if (!token) {
//         navigate("/signup");
//         return;
//       }

//       try {
//         const res = await verifyAccount({ token }).unwrap();
//         localStorage.setItem("role",res.data.role)
//         localStorage.setItem("email",res.data.email)
//         // localStorage.set("role",res.data.role)
//         //(res)
//           // localStorage.setItem("email",email)
        
//         // localStorage.setItem("isVerified", "true");
//         // localStorage.setItem("role", res.role || "USER");
//         Cookies.set("token", token , { expires: 70000 });
//         alert("Your account has been verified!");
//         navigate("/login");
//       } catch (err) {
//         alert("Verification failed or expired. Please sign up again.");
//         navigate("/signup");
//       }
//     };

//     verify();
//   }, [token, verifyAccount, navigate]);

//   return <div>{isLoading ? "Verifying..." : "Redirecting..."}</div>;
// };

// export default VerifyAccount;







// // src/components/Athontication/VerifyAccount.tsx
// import React, { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useVerifyAccountMutation } from "@/redux/features/auth/authApi";

// const VerifyAccount = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [verifyAccount, { isLoading }] = useVerifyAccountMutation();

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const response = await verifyAccount({ token }).unwrap();

//         // Save user details to localStorage
//         localStorage.setItem("isVerified", "true");
//         localStorage.setItem("role", response?.role || "USER");

//         // Go to home page
//         navigate("/home");
//       } catch (error) {
//         alert("Verification link is invalid or expired. Please sign up again.");
//         navigate("/signup");
//       }
//     };

//     verify();
//   }, [token, verifyAccount, navigate]);

//   return <div>{isLoading ? "Verifying your account..." : "Redirecting..."}</div>;
// };

// export default VerifyAccount;





// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useVerifyAccountMutation } from "@/redux/features/auth/authApi";
// import Cookies from "js-cookie";

// const VerifyAccountPage = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const navigate = useNavigate();
//   const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
//   const [message, setMessage] = useState("Verifying your account...");

//   useEffect(() => {
//     if (token) {
//       verifyAccount({ token })
//         .unwrap()
//         .then((res: any) => {
//           setMessage("Your account has been verified! Logging you in...");
          
//           // Optionally automatically log in
//           // Assuming backend returns accessToken in verification response
//           Cookies.set("token", res.data.accessToken, { expires: 7 });

//           setTimeout(() => navigate("/"), 2000); // redirect to home
//         })
//         .catch((err) => {
//           setMessage(err.data?.message || "Verification failed");
//         });
//     }
//   }, [token]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p>{isLoading ? "Verifying..." : message}</p>
//     </div>
//   );
// };

// export default VerifyAccountPage;
