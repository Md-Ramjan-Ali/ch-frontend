// src/pages/Unauthorized.tsx

import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-10 text-center space-y-6">

        <h1 className="text-6xl font-bold text-red-600 tracking-tight">
          403
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800">
          Access Restricted
        </h2>

        <p className="text-gray-600 leading-relaxed">
          You’ve reached a protected zone. Your current credentials do not grant
          permission to cross this threshold. However, all is not lost.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">

          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition-all duration-300"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Unauthorized;