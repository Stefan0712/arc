import { clsx } from 'clsx';
import {motion} from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
        <div 
        className="w-full max-w-sm bg-menu-section border border-menu-section-border rounded-cards shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-secondary leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex border-t border-menu-section-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-4 text-sm font-semibold text-secondary hover:bg-page transition-colors border-r border-menu-section-border"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={clsx(
              "flex-1 px-4 py-4 text-sm font-bold transition-colors",
              isDestructive 
                ? "text-red-500 hover:bg-red-500/10" 
                : "text-accent hover:bg-accent/10"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </motion.div>
  );
}