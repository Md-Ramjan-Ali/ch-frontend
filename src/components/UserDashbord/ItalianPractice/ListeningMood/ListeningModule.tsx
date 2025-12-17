
import React, { useState } from 'react';
import { ChevronLeft, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ListeningPractice from './ListeningPractice';
import ListeningDictation from './ListeningDictation';
import SentenceOrdering from './SentenceOrdering';
import ListeningPracticeComplete from './ListeningPracticeComplete';

const ListeningModule: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'practice' | 'dictation' | 'ordering' | 'complete'>('practice');

  // Audio state (for audio player above questions)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(150); // example 2:30
  // const [speed, setSpeed] = useState(1);
  // const [volume, setVolume] = useState(0.7);
  // const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentTime(parseFloat(e.target.value));
  // const handleSpeedChange = (inc: boolean) => setSpeed(prev => Math.min(2, Math.max(0.5, inc ? prev + 0.25 : prev - 0.25)));
  // const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => { setVolume(parseFloat(e.target.value)); if(parseFloat(e.target.value)>0) setIsMuted(false); };
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Only show header + audio player if not on 'complete' */}
        {currentStep !== 'complete' && (
          <>
            {/* Header */}
             <button
            onClick={() => navigate("/user/practice")}
            className="flex border p-3 cursor-pointer rounded-2xl   items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base font-semibold ">Back To Practice</span>
          </button>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Listening Practice</h1>
              <p className="text-gray-600">Improve your Italian listening comprehension</p>
            </div>

            {/* Audio Player */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Headphones className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Una Conversazione al Bar</span>
              </div>

              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer mb-1"
                style={{
                  background: `linear-gradient(to right, #d1d5db 0%, #d1d5db ${(currentTime/duration)*100}%, #e5e7eb ${(currentTime/duration)*100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={handlePlayPause} className="w-14 h-14 bg-indigo-600  hover:bg-indigo-700 cursor-pointer rounded-full flex items-center justify-center">
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step Components */}
        {currentStep === 'practice' && <ListeningPractice continueCallback={() => setCurrentStep('dictation')} />}
        {currentStep === 'dictation' && <ListeningDictation continueCallback={() => setCurrentStep('ordering')} />}
        {currentStep === 'ordering' && <SentenceOrdering continueCallback={() => setCurrentStep('complete')} />}
        {currentStep === 'complete' && <ListeningPracticeComplete />}
      </div>
    </div>
  );
};

export default ListeningModule;












 