import React from 'react';
import { Volume2, Mic } from 'lucide-react';

interface PronunciationExerciseProps {
    onTryAgain: () => void;
    onContinue: () => void;
}

export const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({ onTryAgain, onContinue }) => {
    // Hardcoded data to match image_dd039d.png
    const score = 94;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-2xl w-full p-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">
                            "Dove Posso Trovare Una Farmacia?"
                        </h2>
                        <p className="text-gray-600 text-lg mb-4">
                            Where can I find a pharmacy?
                        </p>
                        <button className="px-3 cursor-pointer py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            Hide Phonetic
                        </button>
                        <p className="text-gray-500 text-xs mt-1">
                            [DOH-veh POS-soh troh-VAH-reh OO-nah far-mah-CHEE-ah]
                        </p>
                    </div>

                    {/* Listen Button */}
                    <div className="flex justify-center mb-10">
                        <button className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                            <Volume2 size={20} className="text-gray-700" />
                            <span className="font-medium text-gray-900">Listen To Pronunciation</span>
                        </button>
                    </div>

                    {/* Score Area */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Record Your Pronunciation
                    </h3>
                    
                    {/* Mic Button (Placeholder for interaction) */}
                    <div className="flex justify-center mb-8">
                         <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Mic className="text-white" size={32} />
                        </div>
                    </div>
                    
                    {/* Score Display (The core of the image) */}
                    <div className="mb-8 p-6 bg-green-50 rounded-xl max-w-sm mx-auto border border-green-200">
                        <div className="text-4xl font-bold text-green-600 mb-2">{score}%</div>
                        <div className="text-sm text-gray-600 mb-4">Pronunciation Score</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>
                        <div className="text-sm text-gray-600">Excellent pronunciation!</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onTryAgain}
                            className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <span>🔄</span>
                            Try Again
                        </button>
                        <button
                            onClick={onContinue}
                            className="px-6 py-3 bg-blue-600 cursor-pointer rounded-lg font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};