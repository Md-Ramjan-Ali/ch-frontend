

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  onNext?: () => void;
  onPrev?: () => void;
}

const NavigationButtons: React.FC<Props> = ({ onNext, onPrev }) => (
  <div className="flex justify-center gap-4 mt-6">
    <button
      onClick={onPrev}
      className="px-6 py-3 cursor-pointer border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
    >
      <ChevronLeft className="w-4 h-4" />
      Previous
    </button>
    <button
      onClick={onNext}
      className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      Next Exercise
      <ChevronLeft className="w-4 h-4 rotate-180" />
    </button>
  </div>
);

export default NavigationButtons;







 