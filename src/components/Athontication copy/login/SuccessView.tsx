
// Login/SuccessView.tsx
import { Check, X } from "lucide-react";

interface Props {
  onBackToLogin: () => void;
}

const SuccessView = ({ onBackToLogin }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-black/50 relative transition-colors">
        <button
          onClick={onBackToLogin}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500 dark:text-green-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Password Reset Successful
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Your password has been reset successfully.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessView;










// // Login/SuccessView.tsx
// import { Check, X } from "lucide-react";

// interface Props {
//   onBackToLogin: () => void;
// }

// const SuccessView = ({ onBackToLogin }: Props) => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
//         <button
//           onClick={onBackToLogin}
//           className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
//         >
//           <X size={20} />
//         </button>

//         <div className="text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Check className="text-green-500" size={40} />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful</h2>
//           <p className="text-gray-600 text-sm mb-6">Your password has been reset successfully.</p>
//           <button
//             onClick={onBackToLogin}
//             className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuccessView;
