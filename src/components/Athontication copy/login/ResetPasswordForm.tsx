/* eslint-disable @typescript-eslint/no-explicit-any */

// src/pages/ResetPasswordForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// Validation Schema
const resetPasswordSchema = z
  .object({
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const resetForm = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      await resetPassword({ 
        email: email, 
        code: code,
        password: data.password,
        confirmPassword: data.confirmPassword 
      }).unwrap();
      
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error: any) {
      alert(error?.data?.message || "Failed to reset password");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500 dark:text-green-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50">
        <button
          onClick={() => navigate("/forgot-password")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reset Password</h2>
        
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Reset password for: <strong>{email}</strong>
          </p>
        </div>
        
        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
          Enter your new password below
        </p>

        <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...resetForm.register("password")}
                placeholder="Enter new password"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {resetForm.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {resetForm.formState.errors.password.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...resetForm.register("confirmPassword")}
                placeholder="Confirm new password"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {resetForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;










// // src/pages/ResetPasswordForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// // Validation Schema
// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

// const ResetPasswordForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token") || "";
//   const email = searchParams.get("email") || "";
//   const navigate = useNavigate();

//   const [resetPassword] = useResetPasswordMutation();

//   const resetForm = useForm<ResetPasswordInputs>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const onSubmit = async (data: ResetPasswordInputs) => {
//     try {
//       await resetPassword({ token, email, newPassword: data.password }).unwrap();
//       alert("Password reset successful!");
//       navigate("/login");
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
//       <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 transition-colors">
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reset Password</h2>
//         <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">Enter your new password below</p>

//         <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
//           {/* Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               New Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...resetForm.register("password")}
//                 placeholder="New password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
//               Confirm Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 {...resetForm.register("confirmPassword")}
//                 placeholder="Confirm password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;






// // src/pages/ResetPasswordForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// // Validation Schema
// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

// const ResetPasswordForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token") || "";
//   const email = searchParams.get("email") || "";
//   const navigate = useNavigate();

//   const [resetPassword] = useResetPasswordMutation();

//   const resetForm = useForm<ResetPasswordInputs>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const onSubmit = async (data: ResetPasswordInputs) => {
//     try {
//       await resetPassword({ token, email, newPassword: data.password }).unwrap();
//       alert("Password reset successful!");
//       navigate("/login");
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
//         <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>

//         <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
//           {/* Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               New Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...resetForm.register("password")}
//                 placeholder="New password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Confirm Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 {...resetForm.register("confirmPassword")}
//                 placeholder="Confirm password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {resetForm.formState.errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;













// // Login/ResetPasswordForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";

// // Validation
// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

// interface Props {
//   resetPassword: any;
//   email: string;
//   onSuccess: () => void;
// }

// const ResetPasswordForm = ({ resetPassword, email, onSuccess }: Props) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const resetForm = useForm<ResetPasswordInputs>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   // const onSubmit = async (data: ResetPasswordInputs) => {
//   //   try {
//   //     await resetPassword({ email, password: data.password }).unwrap();
//   //     onSuccess();
//   //   } catch (error: any) {
//   //     alert(error.data?.message || "Failed to reset password");
//   //   }
//   // };

//  const [searchParams] = useSearchParams();
//   const token = searchParams.get("token") || "";
//   const email = searchParams.get("email") || "";
//   const navigate = useNavigate();

//   const [newPassword, setNewPassword] = useState("");
//   const [resetPassword] = useResetPasswordMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await resetPassword({ token, email, newPassword }).unwrap();
//       alert("Password reset successful!");
//       navigate("/login"); // send user to login page after success
//     } catch (error: any) {
//       alert(error?.data?.message || "Failed to reset password");
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
//         <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>

//         <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password *</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 {...resetForm.register("password")}
//                 placeholder="New password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.password && (
//               <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.password.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 {...resetForm.register("confirmPassword")}
//                 placeholder="Confirm password"
//                 className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.confirmPassword.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;
