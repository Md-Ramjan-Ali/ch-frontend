/* eslint-disable @typescript-eslint/no-explicit-any */

// src/pages/ResetPasswordForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// Validation Schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [resetPassword] = useResetPasswordMutation();

  const resetForm = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      await resetPassword({
      token,
      email,
      newPassword: data.password,
    }).unwrap();
      alert("Password reset successful!");
      navigate("/login");
    } catch (error: any) {
      alert(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 transition-colors">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">Enter your new password below</p>

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
                placeholder="New password"
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
                placeholder="Confirm password"
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
            className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;







// // src/pages/ResetPasswordPage.tsx
// import React, { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

// const ResetPasswordPage = () => {
//   const [searchParams] = useSearchParams();
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
//     <div>
//       <h2>Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />
//         <button type="submit">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPasswordPage;
