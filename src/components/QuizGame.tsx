import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { DictionaryPopup } from './DictionaryPopup';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { UserData } from '../App';

type QuizGameProps = {
  userData: UserData;
  onComplete: (score: number) => void;
};

type Question = {
  id: number;
  situation: string;
  question: string;
  perspective: 'aggressor' | 'witness';
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type DictionaryEntry = {
  term: string;
  explanation: string;
  alternative: string;
};

const questions: Question[] = [
  {
    id: 1,
    situation: 'Você está em uma reunião e faz um comentário dizendo "você é muito articulado para uma pessoa negra" para um colega.',
    question: 'Você percebe que cometeu um erro. Como deve agir?',
    perspective: 'aggressor',
    options: [
      'Pedir desculpas sinceras, explicar que foi preconceituoso e comprometer-se a aprender',
      'Dizer "foi só um elogio, você está sendo sensível demais"',
      'Ignorar e fingir que nada aconteceu',
      'Justificar dizendo "eu tenho amigos negros, não sou racista"'
    ],
    correctAnswer: 0,
    explanation: 'Reconhecer o erro, pedir desculpas genuínas e se comprometer a mudar é essencial. Comentários que demonstram surpresa com a capacidade de pessoas negras são preconceituosos e reforçam estereótipos.'
  },
  {
    id: 2,
    situation: 'Seu amigo negro conta que foi seguido por seguranças em uma loja enquanto fazia compras.',
    question: 'Como você se sentiria e o que deveria fazer como amigo?',
    perspective: 'witness',
    options: [
      'Acreditar e validar sua experiência, oferecer apoio e questionar o racismo dessa prática',
      'Dizer "talvez você estava parecendo suspeito, não leve para o lado pessoal"',
      'Mudar de assunto porque é desconfortável',
      'Dizer "isso acontece com todo mundo, não é racismo"'
    ],
    correctAnswer: 0,
    explanation: 'Quando alguém relata uma experiência de racismo, devemos acreditar, validar seus sentimentos e oferecer apoio. Minimizar ou questionar a experiência é uma forma de violência.'
  },
  {
    id: 3,
    situation: 'Você tocou no cabelo de uma colega negra sem pedir permissão durante uma conversa.',
    question: 'Ela demonstra desconforto. O que você deveria fazer?',
    perspective: 'aggressor',
    options: [
      'Pedir desculpas imediatamente e reconhecer que invadiu seu espaço pessoal',
      'Dizer "relaxa, era só curiosidade, seu cabelo é tão diferente"',
      'Se ofender porque "foi só um carinho"',
      'Continuar tocando explicando que é um elogio'
    ],
    correctAnswer: 0,
    explanation: 'Tocar no cabelo de pessoas negras sem consentimento é invasivo e desrespeitoso. Cabelos crespos não são objetos de curiosidade. Sempre peça permissão e respeite os limites pessoais.'
  },
  {
    id: 4,
    situation: 'Você presencia um colega fazendo uma "piada" racista no ambiente de trabalho e todos riem.',
    question: 'Como você se sentiria e como deveria agir?',
    perspective: 'witness',
    options: [
      'Sentir-se incomodado, não rir e depois conversar com o colega sobre por que isso é inadequado',
      'Rir junto para não parecer "chato"',
      'Ficar quieto porque "é só uma piada"',
      'Fazer outra piada semelhante para se enturmar'
    ],
    correctAnswer: 0,
    explanation: 'Não devemos ser coniventes com "piadas" racistas. O silêncio é cumplicidade. É importante posicionar-se contra o racismo, mesmo quando isso nos coloca em situação desconfortável.'
  },
  {
    id: 5,
    situation: 'Você chamou uma pessoa negra de "moreno" ou "pessoa de cor" ao invés de negro.',
    question: 'A pessoa corrige você educadamente. Como deve reagir?',
    perspective: 'aggressor',
    options: [
      'Agradecer a correção, pedir desculpas e usar o termo correto',
      'Dizer "é a mesma coisa, você está exagerando"',
      'Ficar ofendido porque "estava tentando ser educado"',
      'Insistir que "moreno soa melhor e menos agressivo"'
    ],
    correctAnswer: 0,
    explanation: 'Usar eufemismos como "moreno" ou "de cor" para evitar dizer "negro" é problemático, pois sugere que negritude é algo negativo. "Negro" e "pessoa negra" são termos corretos e dignos.'
  },
  {
    id: 6,
    situation: 'Sua irmã negra chega em casa chorando porque foi vítima de racismo na escola.',
    question: 'Como você deveria agir como familiar?',
    perspective: 'witness',
    options: [
      'Acolhê-la, acreditar no relato, oferecer suporte emocional e buscar medidas junto à escola',
      'Dizer "ignora, quanto mais você ligar, pior fica"',
      'Sugerir que ela "não seja tão sensível"',
      'Culpá-la dizendo "o que você fez para provocarem isso?"'
    ],
    correctAnswer: 0,
    explanation: 'Vítimas de racismo precisam de acolhimento, validação e apoio concreto. Nunca devemos minimizar a dor ou culpar a vítima. É fundamental tomar atitudes práticas para combater o racismo.'
  },
  {
    id: 7,
    situation: 'Você disse para um colega negro que ele "tem inveja branca" de uma conquista sua.',
    question: 'Ele explica que a expressão é racista. O que fazer?',
    perspective: 'aggressor',
    options: [
      'Reconhecer o erro, pedir desculpas e parar de usar a expressão',
      'Argumentar que "sempre falei assim e nunca foi problema"',
      'Dizer "você está procurando pelo em ovo"',
      'Continuar usando porque "é só uma expressão comum"'
    ],
    correctAnswer: 0,
    explanation: 'Expressões como "inveja branca", "lista negra" e "mercado negro" associam cores a valores positivos e negativos, reforçando o racismo. Devemos aceitar a educação e mudar nosso vocabulário.'
  },
  {
    id: 8,
    situation: 'Você vê uma mulher negra sendo confundida com a empregada doméstica em um evento social.',
    question: 'Como você se sentiria e o que deveria fazer?',
    perspective: 'witness',
    options: [
      'Sentir indignação, intervir educadamente corrigindo o erro e apoiar a mulher',
      'Pensar "que situação constrangedora" mas não fazer nada',
      'Achar engraçado internamente',
      'Ignorar completamente'
    ],
    correctAnswer: 0,
    explanation: 'Mulheres negras são frequentemente vítimas desse tipo de preconceito. Devemos intervir ativamente contra essas situações, demonstrando que racismo não será tolerado.'
  },
  {
    id: 9,
    situation: 'Você perguntou a uma pessoa negra "onde você aprendeu a falar tão bem português?"',
    question: 'A pessoa se ofende. O que você deveria ter feito diferente?',
    perspective: 'aggressor',
    options: [
      'Nunca fazer essa pergunta, pois pressupõe que pessoas negras não falam bem português',
      'Insistir na pergunta porque "era curiosidade genuína"',
      'Dizer "você entendeu errado, era um elogio"',
      'Ficar bravo porque "está tudo errado hoje em dia"'
    ],
    correctAnswer: 0,
    explanation: 'Essa pergunta pressupõe que pessoas negras não dominariam bem o idioma, o que é racista. Pessoas negras são brasileiras e têm pleno domínio do português como qualquer outra pessoa.'
  },
  {
    id: 10,
    situation: 'Seu primo negro foi abordado violentamente pela polícia sem motivo aparente.',
    question: 'Como você deveria agir como familiar?',
    perspective: 'witness',
    options: [
      'Oferecer apoio, documentar o caso, buscar assistência jurídica e denunciar',
      'Dizer "você deve ter feito algo para chamar atenção"',
      'Aconselhar "da próxima vez se comporte melhor"',
      'Minimizar dizendo "polícia trata todo mundo mal"'
    ],
    correctAnswer: 0,
    explanation: 'O perfilamento racial pela polícia é real e violento. Devemos apoiar vítimas, documentar abusos e buscar responsabilização. Nunca culpar a vítima.'
  },
  {
    id: 11,
    situation: 'Você disse que o cabelo da sua colega estava "mais apresentável" depois que ela alisou.',
    question: 'Ela fica visivelmente chateada. O que você deve fazer?',
    perspective: 'aggressor',
    options: [
      'Pedir desculpas sinceras e reconhecer que o comentário foi racista e ofensivo',
      'Justificar dizendo "mas ficou bonito assim também"',
      'Dizer "você está sendo dramática"',
      'Culpar a sociedade mas não assumir responsabilidade pessoal'
    ],
    correctAnswer: 0,
    explanation: 'Sugerir que cabelos alisados são mais "apresentáveis" que cabelos naturais é racismo estético. Cabelos crespos são lindos e profissionais em sua forma natural.'
  },
  {
    id: 12,
    situation: 'Você percebe que uma pessoa negra está sendo ignorada por vendedores em uma loja enquanto clientes brancos são atendidos.',
    question: 'Como você se sentiria e deveria agir?',
    perspective: 'witness',
    options: [
      'Sentir indignação, chamar atenção para isso e pedir que atendam a pessoa',
      'Pensar "não é comigo" e seguir com suas compras',
      'Achar que a pessoa não parece ter dinheiro mesmo',
      'Aproveitar para ser atendido mais rápido'
    ],
    correctAnswer: 0,
    explanation: 'Racismo em estabelecimentos comerciais é crime. Devemos intervir ativamente, denunciar e não ser coniventes com discriminação.'
  },
  {
    id: 13,
    situation: 'Você questionou a competência de um médico negro antes mesmo da consulta começar.',
    question: 'Você percebe seu preconceito. O que fazer?',
    perspective: 'aggressor',
    options: [
      'Reconhecer internamente o preconceito, dar chance ao profissional e trabalhar para desconstruir esse viés',
      'Pedir para trocar de médico sem dar explicações',
      'Ficar o tempo todo desconfiado',
      'Questionar abertamente suas qualificações'
    ],
    correctAnswer: 0,
    explanation: 'Questionar competência baseado em raça é racismo. Profissionais negros enfrentam isso constantemente. Devemos reconhecer nossos vieses e trabalhar para eliminá-los.'
  },
  {
    id: 14,
    situation: 'Seu amigo negro compartilha que não se sente seguro em determinados lugares por causa do racismo.',
    question: 'Como você deveria responder?',
    perspective: 'witness',
    options: [
      'Ouvir com empatia, validar o sentimento e oferecer suporte concreto',
      'Dizer "você está paranóico"',
      'Argumentar "mas eu vou lá e nunca acontece nada"',
      'Mudar de assunto porque é desconfortável'
    ],
    correctAnswer: 0,
    explanation: 'O medo e a insegurança que pessoas negras sentem por causa do racismo são reais. Devemos ouvir, acreditar e oferecer apoio, não questionar ou minimizar.'
  },
  {
    id: 15,
    situation: 'Você elogiou uma pessoa negra dizendo "você é bonito apesar de ser negro".',
    question: 'A pessoa se ofende profundamente. O que você deveria ter feito?',
    perspective: 'aggressor',
    options: [
      'Nunca fazer esse "elogio", pois ser negro não é um defeito a ser superado',
      'Insistir que "era para ser um elogio"',
      'Dizer "você entendeu errado"',
      'Ficar ofendido porque "estava sendo gentil"'
    ],
    correctAnswer: 0,
    explanation: 'Esse tipo de "elogio" é extremamente racista porque trata negritude como algo negativo. Ser negro é lindo e não é "apesar de", é "porque".'
  }
];

const dictionaryEntries: DictionaryEntry[] = [
  {
    term: 'Denegrir',
    explanation: 'Palavra derivada de "negro" usada com sentido negativo (manchar, difamar), reforçando associações negativas à negritude.',
    alternative: 'Use "difamar", "caluniar", "manchar a reputação" ou "desvalorizar".'
  },
  {
    term: 'Inveja branca / Coisa de preto / A coisa tá preta',
    explanation: 'Expressões que associam branco ao positivo e preto ao negativo, perpetuando racismo linguístico.',
    alternative: 'Use "inveja saudável", "admiração" / "complicado", "difícil", "mal feito" / "a situação está difícil".'
  },
  {
    term: 'Cabelo ruim / Cabelo duro',
    explanation: 'Termos pejorativos que denigrem o cabelo natural de pessoas negras, reforçando padrões estéticos eurocêntricos racistas.',
    alternative: 'Use "cabelo crespo", "cabelo cacheado" ou "cabelo natural" - são características, não defeitos.'
  },
  {
    term: 'Moreno / Moreninho (para evitar dizer negro)',
    explanation: 'Eufemismo usado para evitar dizer "negro", como se fosse algo negativo. É uma forma de apagamento da identidade racial.',
    alternative: 'Use "negro" ou "pessoa negra" - são termos corretos, dignos e não ofensivos.'
  },
  {
    term: 'Serviço de preto / Nas coxas',
    explanation: 'Expressões extremamente racistas que associam trabalho mal feito à população negra e têm origem no período escravocrata.',
    alternative: 'Use "trabalho mal feito", "serviço desleixado", "mal executado" ou "trabalho inadequado".'
  }
];

export function QuizGame({ userData, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showDictionary, setShowDictionary] = useState(false);
  const [answered, setAnswered] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    setAnswered(true);
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswered(false);

    if (currentQuestion < questions.length - 1) {
      // Mostrar dicionário a cada 3 perguntas
      if ((currentQuestion + 1) % 3 === 0) {
        setShowDictionary(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    } else {
      onComplete(score);
    }
  };

  const handleDictionaryClose = () => {
    setShowDictionary(false);
    setCurrentQuestion(currentQuestion + 1);
  };

  const getDictionaryEntry = () => {
    const index = Math.floor(currentQuestion / 3) % dictionaryEntries.length;
    return dictionaryEntries[index];
  };

  return (
    <>
      <div className="py-8">
        <Card className="max-w-3xl mx-auto p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{userData.avatar}</span>
                </div>
                <div>
                  <p className="text-gray-800">
                    {userData.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                <Trophy className="w-5 h-5 text-gray-900" />
                <span className="text-gray-900">{score} pontos</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Questão {currentQuestion + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl mb-4 border-2 border-amber-200">
                <p className="text-sm text-gray-600 mb-2">
                  {question.perspective === 'aggressor' ? '🤔 Você como agressor:' : '👥 Você como testemunha:'}
                </p>
                <p className="text-gray-800 mb-3">
                  {question.situation}
                </p>
                <h3 className="text-gray-900">
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !answered && setSelectedAnswer(index)}
                    disabled={answered}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all duration-300
                      ${!answered && selectedAnswer === index 
                        ? 'bg-amber-100 border-2 border-gray-900 shadow-md' 
                        : 'bg-white border-2 border-gray-200 hover:border-amber-300'
                      }
                      ${answered && index === question.correctAnswer 
                        ? 'bg-green-100 border-green-500' 
                        : ''
                      }
                      ${answered && selectedAnswer === index && index !== question.correctAnswer 
                        ? 'bg-red-100 border-red-500' 
                        : ''
                      }
                      ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                        ${!answered && selectedAnswer === index 
                          ? 'bg-gray-900 text-amber-400' 
                          : 'bg-gray-200 text-gray-600'
                        }
                        ${answered && index === question.correctAnswer 
                          ? 'bg-green-500 text-white' 
                          : ''
                        }
                        ${answered && selectedAnswer === index && index !== question.correctAnswer 
                          ? 'bg-red-500 text-white' 
                          : ''
                        }
                      `}>
                        {answered && index === question.correctAnswer && '✓'}
                        {answered && selectedAnswer === index && index !== question.correctAnswer && '✗'}
                        {!answered && (String.fromCharCode(65 + index))}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Result Feedback */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    p-4 rounded-xl mb-6 border-2
                    ${selectedAnswer === question.correctAnswer 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {selectedAnswer === question.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className={selectedAnswer === question.correctAnswer ? 'text-green-800' : 'text-red-800'}>
                        {selectedAnswer === question.correctAnswer ? 'Muito bem! Resposta correta!' : 'Vamos refletir sobre isso.'}
                      </p>
                      <p className="text-gray-700 mt-2">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {!showResult ? (
                  <Button 
                    onClick={handleAnswer}
                    disabled={selectedAnswer === null}
                    className="px-8 bg-gray-900 hover:bg-gray-800 text-amber-400"
                  >
                    Responder
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    className="px-8 bg-gray-900 hover:bg-gray-800 text-amber-400"
                  >
                    {currentQuestion < questions.length - 1 ? 'Próxima' : 'Ver Resultado'}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Dictionary Popup */}
      <DictionaryPopup
        isOpen={showDictionary}
        onClose={handleDictionaryClose}
        entry={getDictionaryEntry()}
      />
    </>
  );
}
