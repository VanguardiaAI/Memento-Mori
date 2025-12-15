'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface DisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Disclaimer({ isOpen, onClose }: DisclaimerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-dark/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-cream rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-subtle flex items-center justify-between">
              <h2 className="text-lg font-display text-dark tracking-wide">
                Aviso importante
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-dark hover:text-dark transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-dark">
                Esta herramienta es una reflexión sobre el tiempo y la finitud de la vida.
                No pretende ser una predicción ni un cálculo exacto de esperanza de vida.
              </p>

              <p className="text-gray-dark">
                El propósito es inspirar una mayor consciencia sobre el valor del tiempo
                y motivar a vivir de manera más intencional.
              </p>

              <div className="p-4 bg-gold/10 rounded-lg border border-gold/30">
                <p className="text-dark font-medium mb-2">
                  Si estás pasando por un momento difícil:
                </p>
                <p className="text-gray-dark text-sm mb-3">
                  Recuerda que no estás solo/a. Buscar ayuda es un acto de valentía.
                </p>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.telefonodelaesperanza.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gold hover:text-gold-light transition-colors"
                  >
                    → Teléfono de la Esperanza (España): 717 003 717
                  </a>
                  <a
                    href="https://www.saptel.org.mx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gold hover:text-gold-light transition-colors"
                  >
                    → SAPTEL (México): 55 5259 8121
                  </a>
                  <a
                    href="https://www.suicidepreventionlifeline.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gold hover:text-gold-light transition-colors"
                  >
                    → Línea de Prevención (Internacional): 988
                  </a>
                </div>
              </div>

              <p className="text-xs text-gray-dark text-center">
                Cada día es una oportunidad. Cuida de ti.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
