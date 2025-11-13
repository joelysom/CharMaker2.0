import { useState } from 'react';
import { UserForm } from './components/UserForm';
import { AvatarSelection } from './components/AvatarSelection';
import { QuizGame } from './components/QuizGame';
import { ResultScreen } from './components/ResultScreen';
import { MainMenu } from './components/MainMenu';
import { Community } from './components/Community';
import { Library } from './components/Library';
import { LocalsPE } from './components/LocalsPE';
import { Stories } from './components/Stories';
import { Support } from './components/Support';

export type UserData = {
  name: string;
  age: number;
  avatar: string;
};

export type GameStep = 'form' | 'avatar' | 'quiz' | 'result' | 'menu' | 'community' | 'library' | 'locals' | 'stories' | 'support';

export default function App() {
  const [currentStep, setCurrentStep] = useState<GameStep>('form');
  const [userData, setUserData] = useState<UserData>({ name: '', age: 0, avatar: '' });
  const [score, setScore] = useState(0);

  const handleFormComplete = (name: string, age: number) => {
    setUserData({ ...userData, name, age });
    setCurrentStep('avatar');
  };

  const handleAvatarComplete = (avatar: string) => {
    setUserData({ ...userData, avatar });
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setCurrentStep('result');
  };

  const handleResultContinue = () => {
    setCurrentStep('menu');
  };

  const handleRestart = () => {
    setCurrentStep('form');
    setUserData({ name: '', age: 0, avatar: '' });
    setScore(0);
  };

  const navigateTo = (step: GameStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {currentStep === 'form' && (
          <UserForm onComplete={handleFormComplete} />
        )}
        {currentStep === 'avatar' && (
          <AvatarSelection userName={userData.name} onComplete={handleAvatarComplete} />
        )}
        {currentStep === 'quiz' && (
          <QuizGame userData={userData} onComplete={handleQuizComplete} />
        )}
        {currentStep === 'result' && (
          <ResultScreen 
            userData={userData} 
            score={score} 
            totalQuestions={15}
            onRestart={handleRestart}
            onContinue={handleResultContinue}
          />
        )}
        {currentStep === 'menu' && (
          <MainMenu userData={userData} onNavigate={navigateTo} />
        )}
        {currentStep === 'community' && (
          <Community userData={userData} onBack={() => navigateTo('menu')} />
        )}
        {currentStep === 'library' && (
          <Library userData={userData} onBack={() => navigateTo('menu')} />
        )}
        {currentStep === 'locals' && (
          <LocalsPE userData={userData} onBack={() => navigateTo('menu')} />
        )}
        {currentStep === 'stories' && (
          <Stories userData={userData} onBack={() => navigateTo('menu')} />
        )}
        {currentStep === 'support' && (
          <Support userData={userData} onBack={() => navigateTo('menu')} />
        )}
      </div>
    </div>
  );
}