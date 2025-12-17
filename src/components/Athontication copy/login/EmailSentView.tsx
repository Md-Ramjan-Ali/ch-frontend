 










// Login/EmailSentView.tsx
import { Mail, X } from "lucide-react";

interface Props {
  email: string;
  onReset: () => void;
  onClose: () => void;
}

const EmailSentView = ({ email, onReset, onClose }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-cyan-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Sent</h2>
          <p className="text-gray-600 text-sm mb-6">
            We have sent a password reset link successfully to<br />
            <span className="font-medium text-gray-800">{email}</span>
          </p>
          <button
            onClick={onReset}
            className="w-full cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
          >
            Reset Password Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSentView;
