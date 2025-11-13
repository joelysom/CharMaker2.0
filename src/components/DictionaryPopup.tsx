import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { BookOpen, AlertCircle, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

type DictionaryEntry = {
  term: string;
  explanation: string;
  alternative: string;
};

type DictionaryPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  entry: DictionaryEntry;
};

export function DictionaryPopup({ isOpen, onClose, entry }: DictionaryPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-gray-900" />
            </div>
            <span>Dicionário da Consciência</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Aprenda sobre termos inadequados e suas alternativas respeitosas
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 py-4"
        >
          {/* Term Section */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-red-800 mb-2">
                  Termo inadequado: "{entry.term}"
                </h4>
                <p className="text-gray-700">
                  {entry.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Section */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-green-800 mb-2">
                  Alternativa recomendada:
                </h4>
                <p className="text-gray-700">
                  {entry.alternative}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <p className="text-gray-700 text-sm">
              <strong className="text-gray-900">Lembre-se:</strong> A linguagem que usamos 
              reflete e constrói nossa sociedade. Ao escolhermos palavras mais conscientes e 
              respeitosas, contribuímos para um ambiente mais justo e inclusivo para todas as pessoas.
            </p>
          </div>

          <Button onClick={onClose} className="w-full bg-gray-900 hover:bg-gray-800 text-amber-400">
            Continuar Aprendendo
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}