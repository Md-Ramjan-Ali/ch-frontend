import React from 'react';
import { Mic } from 'lucide-react';

interface MicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  label: string;
}

const MicButton: React.FC<MicButtonProps> = ({ isRecording, onClick, label }) => (
  <div className="text-center">
    <div className="flex justify-center mb-6">
      <button
        onClick={onClick}
        className={`w-20 h-20 cursor-pointer rounded-full flex items-center justify-center transition-all ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        aria-label={label}
      >
        <Mic className="text-white" size={32} />
      </button>
    </div>
    <p className="text-gray-600 text-sm mb-8">
      {isRecording ? 'Recording...' : label}
    </p>
  </div>
);

export default MicButton;
