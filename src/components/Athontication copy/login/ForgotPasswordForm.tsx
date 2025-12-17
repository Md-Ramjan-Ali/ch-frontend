/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Key, CheckCircle, ArrowLeft } from "lucide-react";
import { useForgotPasswordMutation, useVerifyResetCodeMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";

// Validation schemas
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const verifyCodeSchema = z.object({
  code: z.string().min(6, "Code must be 6 characters").max(6, "Code must be 6 characters"),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
type VerifyCodeInputs = z.infer<typeof verifyCodeSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  
  const navigate = useNavigate();
  
  // Forms
  const emailForm = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const codeForm = useForm<VerifyCodeInputs>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [verifyResetCode, { isLoading: isVerifyingCode }] = useVerifyResetCodeMutation();

  // Step 1: Send reset code
  const onSendCode = async (data: ForgotPasswordInputs) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setEmail(data.email);
      setSentEmail(data.email);
      setStep("code");
    } catch (error: any) {
      alert(error?.data?.message || "Failed to send reset code");
    }
  };

  // Step 2: Verify reset code
  const onVerifyCode = async (data: VerifyCodeInputs) => {
    try {
      await verifyResetCode({ 
        email: email, 
        code: data.code , token: "" 
      }).unwrap();
      
      setStep("success");
      
      // Navigate to reset password page with email and code
      setTimeout(() => {
        navigate(`/reset?email=${encodeURIComponent(email)}&code=${data.code}`);
      }, 2000);
      
    } catch (error: any) {
      alert(error?.data?.message || "Invalid or expired code");
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 transition-colors">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
              Enter your email and we'll send you a verification code
            </p>

            <form onSubmit={emailForm.handleSubmit(onSendCode)} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    {...emailForm.register("email")}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
                  />
                  <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" size={18} />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingCode}
                className="w-full cursor-pointer bg-linear-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingCode ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>
          </div>
        );

      case "code":
        return (
          <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 transition-colors">
            <button
              onClick={() => setStep("email")}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Enter Verification Code</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
              We sent a 6-digit code to <strong>{sentEmail}</strong>
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-6">
              Check your email and enter the code below
            </p>

            <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
              {/* Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  6-digit Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...codeForm.register("code")}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors text-center text-lg tracking-widest"
                  />
                  <Key className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" size={18} />
                </div>
                {codeForm.formState.errors.code && (
                  <p className="text-red-500 text-xs mt-1">{codeForm.formState.errors.code.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifyingCode}
                className="w-full cursor-pointer bg-linear-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingCode ? "Verifying..." : "Verify Code"}
              </button>
              
              {/* Resend Code */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => forgotPassword({ email }).unwrap().then(() => alert("Code resent!"))}
                  className="text-sm text-cyan-500 hover:text-cyan-600"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </form>
          </div>
        );

      case "success":
        return (
          <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Code Verified!</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
              Your code has been verified. Redirecting to password reset page...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      {renderStep()}
    </div>
  );
};

export default ForgotPasswordForm;








// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Mail, CheckCircle } from "lucide-react";
// import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
// import { useNavigate } from "react-router-dom";

// // Validation schema
// const forgotPasswordSchema = z.object({
//   email: z.string().email("Invalid email format"),
// });

// type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

// const ForgotPasswordForm: React.FC = () => {
//   const [isEmailSent, setIsEmailSent] = useState(false);
//   const [sentEmail, setSentEmail] = useState("");
//   const { register, handleSubmit, formState } = useForm<ForgotPasswordInputs>({
//     resolver: zodResolver(forgotPasswordSchema),
//   });

//   const navigate=useNavigate()
//   const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
//   const onSubmit = async (data: ForgotPasswordInputs) => {
//     try {
//       await forgotPassword({ email: data.email }).unwrap();
//       setSentEmail(data.email);
//       setIsEmailSent(true);
//       navigate("/reset")
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to send reset email");
//     }
//   };

//   if (isEmailSent) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
//         <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 text-center">
//           <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4 animate-pulse" />
//           <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Email Sent!</h2>
//           <p className="text-gray-500 dark:text-gray-300 mb-4 text-sm">
//             A password reset link has been sent to <strong>{sentEmail}</strong>.
//           </p>
//           <button
//             onClick={() => setIsEmailSent(false)}
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Send Another Email
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
//       <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 transition-colors">
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Forgot Password?</h2>
//         <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
//           Enter your email and we'll send you a password reset link
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Email *</label>
//             <div className="relative">
//               <input
//                 type="email"
//                 {...register("email")}
//                 placeholder="Enter your email"
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
//               />
//               <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" size={18} />
//             </div>
//             {formState.errors.email && (
//               <p className="text-red-500 text-xs mt-1">{formState.errors.email.message}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordForm;





 

// // Login/ForgotPasswordForm.tsx
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Mail } from "lucide-react";

// // Validation
// const forgotPasswordSchema = z.object({
//   email: z.string().email("Invalid email format"),
// });

// type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

// interface Props {
//   forgotPassword: any;
//   onBack: () => void;
//   onEmailSent: (email: string) => void;
// }

// const ForgotPasswordForm = ({ forgotPassword, onBack, onEmailSent }: Props) => {
//   const forgotForm = useForm<ForgotPasswordInputs>({
//     resolver: zodResolver(forgotPasswordSchema),
//   });

//   const onSubmit = async (data: ForgotPasswordInputs) => {
//     try {
//       await forgotPassword({ email: data.email }).unwrap();
//       onEmailSent(data.email);
//     } catch (error: any) {
//       alert(error.data?.message || "Failed to send reset email");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
//         <p className="text-gray-500 text-sm mb-6">
//           Enter your email and we'll send you a password reset link
//         </p>

//         <form onSubmit={forgotForm.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
//             <div className="relative">
//               <input
//                 type="email"
//                 {...forgotForm.register("email")}
//                 placeholder="Enter your email"
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
//             </div>
//             {forgotForm.formState.errors.email && (
//               <p className="text-red-500 text-xs mt-1">{forgotForm.formState.errors.email.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Send Reset Link
//           </button>
//         </form>

//         <button
//           onClick={onBack}
//           className="w-full text-center cursor-pointer text-sm text-cyan-500 hover:text-cyan-600 font-medium mt-4"
//         >
//           Back to Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordForm;
