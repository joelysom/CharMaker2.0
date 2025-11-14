import React, { useState } from "react";
import styles from "./AvatarSelection.module.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type AvatarSelectionProps = {
  userName: string;
  onComplete: (avatar: string) => void;
};

export function AvatarSelection({ userName, onComplete }: AvatarSelectionProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = (avatar: string) => {
    // marca visualmente, depois abre o modal de confirmação
    setSelected(avatar);
    setPendingSelection(avatar);
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 300);
  };

  const handleConfirm = () => {
    const avatar = pendingSelection;
    setIsConfirming(true);
    setIsDialogOpen(false);
    if (avatar) {
      // manter seleção visual (characterSelected) e depois navegar
      setTimeout(() => {
        setIsConfirming(false);
        // navegar para a página correspondente
        if (avatar === 'female') navigate('/Female');
        if (avatar === 'male') navigate('/Male');
      }, 180);
    }
  };

  const handleCancel = () => {
    // fecha modal e reverte seleção de forma suave
    setIsDialogOpen(false);
    setTimeout(() => {
      setSelected(null);
      setPendingSelection(null);
    }, 180);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Escolha seu Personagem</h2>
      <div className={styles.buttonsWrapper}>
        {/* Botão Feminino */}
        <div
          className={styles.buttonContainer}
          onMouseEnter={() => setHovered('female')}
          onMouseLeave={() => setHovered((prev) => (prev === 'female' ? null : prev))}
          onClick={() => handleClick('female')}
        >
          <img
            src="/gender/red.png"
            alt="Opção Feminina"
            className={`${styles.buttonRed} ${hovered === 'female' ? styles.focusBlur : ''} ${selected === 'female' ? styles.bgSelected : ''}`}
            style={{ width: '1400px', height: 'auto' }}
          />
          <img
            src="/gender/female.png"
            alt="Personagem Feminino"
            className={`${styles.characterOverlay} ${hovered === 'female' ? styles.characterHighlight : ''} ${selected === 'female' ? styles.characterSelected : ''}`}
          />
        </div>

        {/* Botão Masculino */}
        <div
          className={styles.buttonContainer}
          onMouseEnter={() => setHovered('male')}
          onMouseLeave={() => setHovered((prev) => (prev === 'male' ? null : prev))}
          onClick={() => handleClick('male')}
        >
          <img
            src="/gender/blue.png"
            alt="Opção Masculina"
            className={`${styles.buttonBlue} ${hovered === 'male' ? styles.focusBlur : ''} ${selected === 'male' ? styles.bgSelected : ''}`}
            style={{ width: '1400px', height: 'auto' }}
          />
          <img
            src="/gender/male.png"
            alt="Personagem Masculino"
            className={`${styles.characterOverlay} ${hovered === 'male' ? styles.characterHighlight : ''} ${selected === 'male' ? styles.characterSelected : ''}`}
          />
        </div>
      </div>
      {/* Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => {
          // when the dialog is closed (open === false) and we are NOT confirming,
          // revert the selection the same way as Cancel (smoothly)
          setIsDialogOpen(open);
          if (!open && !isConfirming && pendingSelection) {
            setTimeout(() => {
              setSelected(null);
              setPendingSelection(null);
            }, 180);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar escolha</DialogTitle>
            <DialogDescription>
              Deseja realmente escolher este personagem?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            {pendingSelection === 'female' && (
              <img src="/gender/female.png" alt="preview" className="w-40 h-auto object-contain" />
            )}
            {pendingSelection === 'male' && (
              <img src="/gender/male.png" alt="preview" className="w-40 h-auto object-contain" />
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
  );
}
