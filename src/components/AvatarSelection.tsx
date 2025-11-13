import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Info } from 'lucide-react';

type AvatarSelectionProps = {
  userName: string;
  onComplete: (avatar: string) => void;
};

type AvatarOption = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  category: string;
  description: string;
};

const avatars: AvatarOption[] = [
  { 
    id: 'avatar1', 
    label: 'Pessoa Preta 1', 
    emoji: '👨🏿', 
    color: 'from-amber-400 to-yellow-500',
    category: 'Preto',
    description: 'Pessoas pretas possuem pele com tonalidade escura, resultado da alta concentração de melanina. Têm origem predominantemente africana.'
  },
  { 
    id: 'avatar2', 
    label: 'Pessoa Preta 2', 
    emoji: '👩🏿', 
    color: 'from-yellow-400 to-amber-500',
    category: 'Preto',
    description: 'A negritude é uma identidade ancestral, cultural e de resistência histórica.'
  },
  { 
    id: 'avatar3', 
    label: 'Pessoa Preta 3', 
    emoji: '🧑🏿', 
    color: 'from-amber-500 to-orange-500',
    category: 'Preto',
    description: 'Pessoas pretas têm características como cabelos crespos/cacheados e traços diversos.'
  },
  { 
    id: 'avatar4', 
    label: 'Pessoa Parda 1', 
    emoji: '👨🏾', 
    color: 'from-yellow-300 to-amber-400',
    category: 'Pardo',
    description: 'Pessoas pardas têm pele com tonalidade intermediária, resultado da miscigenação racial. No Brasil, compõem junto com pretos a população negra.'
  },
  { 
    id: 'avatar5', 
    label: 'Pessoa Parda 2', 
    emoji: '👩🏾', 
    color: 'from-amber-300 to-yellow-400',
    category: 'Pardo',
    description: 'A categoria parda engloba grande diversidade de tons de pele e características.'
  },
  { 
    id: 'avatar6', 
    label: 'Pessoa Parda 3', 
    emoji: '🧑🏾', 
    color: 'from-yellow-400 to-orange-400',
    category: 'Pardo',
    description: 'Pessoas pardas compartilham experiências do racismo estrutural brasileiro.'
  },
  { 
    id: 'avatar7', 
    label: 'Pessoa Amarela', 
    emoji: '👨🏻', 
    color: 'from-yellow-200 to-amber-300',
    category: 'Amarelo',
    description: 'Pessoas amarelas têm origem asiática (japonesa, chinesa, coreana, etc.) e características como olhos amendoados e cabelos lisos.'
  },
  { 
    id: 'avatar8', 
    label: 'Pessoa Branca', 
    emoji: '👩🏻', 
    color: 'from-gray-200 to-gray-300',
    category: 'Branco',
    description: 'Pessoas brancas têm pele clara com menor concentração de melanina, origem europeia predominante e são privilegiadas estruturalmente no Brasil.'
  },
  { 
    id: 'avatar9', 
    label: 'Pessoa Indígena 1', 
    emoji: '🧑🏽', 
    color: 'from-green-400 to-emerald-500',
    category: 'Indígena',
    description: 'Povos indígenas são os habitantes originários do Brasil, com culturas, línguas e características próprias de cada etnia.'
  },
  { 
    id: 'avatar10', 
    label: 'Pessoa Indígena 2', 
    emoji: '👨🏽', 
    color: 'from-emerald-400 to-green-500',
    category: 'Indígena',
    description: 'Pessoas indígenas preservam conhecimentos ancestrais e lutam pela demarcação de terras e direitos.'
  },
];

export function AvatarSelection({ userName, onComplete }: AvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [showInfo, setShowInfo] = useState(true);

  const handleSubmit = () => {
    if (selectedAvatar) {
      const avatar = avatars.find(a => a.id === selectedAvatar);
      onComplete(avatar?.emoji || '👤');
    }
  };

  const selectedAvatarData = avatars.find(a => a.id === selectedAvatar);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-5xl p-8 shadow-xl">
        <div className="mb-8">
          <h2 className="text-center text-gray-900 mb-2">
            Olá, {userName}!
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Escolha o avatar que mais se identifica com você
          </p>
          
          {showInfo && (
            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-800 mb-2">
                    <strong>Por que identificação racial?</strong>
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    A identificação racial é importante para reconhecermos a diversidade do nosso país 
                    e combatermos o racismo. Cada grupo possui características físicas, culturais e 
                    históricas próprias que merecem ser valorizadas e respeitadas.
                  </p>
                  <p className="text-gray-700 text-sm">
                    Escolher como você se identifica é um ato de autoconhecimento e valorização das suas raízes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`
                relative p-4 rounded-2xl transition-all duration-300 
                ${selectedAvatar === avatar.id 
                  ? 'ring-4 ring-gray-900 scale-105 shadow-xl' 
                  : 'hover:scale-105 shadow-md'
                }
                bg-gradient-to-br ${avatar.color}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">{avatar.emoji}</span>
                <span className="text-xs text-gray-800 text-center">
                  {avatar.category}
                </span>
              </div>
              {selectedAvatar === avatar.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-amber-400">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedAvatarData && (
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-xl mb-6">
            <h4 className="text-gray-900 mb-2">
              {selectedAvatarData.category}
            </h4>
            <p className="text-gray-700 text-sm">
              {selectedAvatarData.description}
            </p>
          </div>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={!selectedAvatar}
          className="w-full bg-gray-900 hover:bg-gray-800 text-amber-400"
        >
          Começar Jornada
        </Button>
      </Card>
    </div>
  );
}
