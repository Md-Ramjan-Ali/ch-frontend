// Create these separate page components:

// FlashcardDecksPage.tsx
import React from 'react';
import FlashcardDecks from '../components/FlashcardDecks';

const FlashcardDecksPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <FlashcardDecks />
    </div>
  );
};

 

// LessonsPage.tsx
 import Lessons from '../components/Lessons';

const LessonsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <Lessons />
    </div>
  );
};

 
// PhraseOfTheDayPage.tsx
 import PhraseOfTheDay from '../components/PhraseOfTheDay';

const PhraseOfTheDayPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <PhraseOfTheDay />
    </div>
  );
};

export default{ PhraseOfTheDayPage ,FlashcardDecksPage,LessonsPage};