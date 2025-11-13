import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Star, Award, Heart, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { UserData } from '../App';

type ResultScreenProps = {
  userData: UserData;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onContinue: () => void;
};

export function ResultScreen({ userData, score, totalQuestions, onRestart, onContinue }: ResultScreenProps) {
  const percentage = (score / totalQuestions) * 100;
  
  const getMessage = () => {
    if (percentage >= 90) {
      return {
        title: 'Excelente! 🎉',
        message: 'Você demonstrou grande consciência e respeito! Continue sendo um agente de mudança positiva.',
        icon: Trophy,
        color: 'from-yellow-400 to-amber-500'
      };
    } else if (percentage >= 70) {
      return {
        title: 'Muito Bem! 🌟',
        message: 'Você está no caminho certo! Continue aprendendo e refletindo sobre igualdade racial.',
        icon: Star,
        color: 'from-amber-400 to-yellow-500'
      };
    } else if (percentage >= 50) {
      return {
        title: 'Bom Começo! 💪',
        message: 'Você já deu passos importantes! Continue estudando e praticando o respeito e a empatia.',
        icon: Award,
        color: 'from-yellow-300 to-amber-400'
      };
    } else {
      return {
        title: 'Continue Aprendendo! 📚',
        message: 'Toda jornada começa com o primeiro passo. Revise o conteúdo e tente novamente!',
        icon: Heart,
        color: 'from-amber-300 to-orange-400'
      };
    }
  };

  const result = getMessage();
  const Icon = result.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Icon */}
          <div className={`w-32 h-32 bg-gradient-to-br ${result.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
            <Icon className="w-16 h-16 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-center text-gray-900 mb-4">
            {result.title}
          </h2>

          {/* Score */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 px-6 py-3 rounded-full mb-4">
              <span className="text-gray-900 text-3xl">
                {score}/{totalQuestions}
              </span>
            </div>
            <p className="text-gray-600 text-lg">
              {percentage.toFixed(0)}% de acertos
            </p>
          </div>

          {/* Message */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl mb-8 text-center border-2 border-amber-200">
            <p className="text-gray-700">
              {result.message}
            </p>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-xl border-2 border-amber-200">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">{userData.avatar}</span>
            </div>
            <div className="text-left">
              <p className="text-gray-800">
                {userData.name}
              </p>
              <p className="text-gray-600 text-sm">
                Completou a jornada!
              </p>
            </div>
          </div>

          {/* Educational Message */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-6 w-full">
            <p className="text-gray-700 text-sm text-center">
              <strong className="text-gray-900">Lembre-se:</strong> A consciência racial é uma 
              jornada contínua de aprendizado, reflexão e ação. Cada passo em direção ao respeito 
              e à igualdade faz diferença na construção de uma sociedade mais justa.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button onClick={onContinue} className="flex-1 bg-gray-900 hover:bg-gray-800 text-amber-400" size="lg">
              Explorar Plataforma
            </Button>
            <Button onClick={onRestart} variant="outline" className="flex-1" size="lg">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refazer Quiz
            </Button>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}