


import React, { useState } from 'react';
import WritingPractice from './WritingPractice';
import CompleteSentences from './CompleteSentences';

const ExercisesContainer: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(1);

  const handleNext = () => setCurrentExercise((prev) => prev + 1);
  const handlePrev = () => setCurrentExercise((prev) => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen">
      {currentExercise === 1 && <WritingPractice />}
      {currentExercise === 2 && (
        <CompleteSentences onPrev={handlePrev} onNext={handleNext} />
      )}
    </div>
  );
};

export default ExercisesContainer;






 