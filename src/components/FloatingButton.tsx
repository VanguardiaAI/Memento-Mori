'use client';

import { motion } from 'framer-motion';

interface FloatingButtonProps {
  onClick: () => void;
  canAddMore: boolean;
}

export function FloatingButton({ onClick, canAddMore }: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={!canAddMore}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full shadow-lg
        flex items-center justify-center
        transition-colors
        ${canAddMore
          ? 'bg-gold text-dark pulse-gold hover:bg-gold-light'
          : 'bg-gray-subtle text-gray-dark cursor-not-allowed'}
      `}
      title={canAddMore ? 'Añadir momento especial' : 'Límite de momentos alcanzado'}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </motion.button>
  );
}
