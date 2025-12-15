'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { validateBirthDate } from '@/utils/dateCalculations';

interface OnboardingProps {
  onComplete: (birthDate: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateBirthDate(birthDate);
    if (!validation.valid) {
      setError(validation.error || 'Fecha inválida');
      return;
    }

    setIsSubmitting(true);
    // Small delay for visual feedback
    setTimeout(() => {
      onComplete(birthDate);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-cream p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md text-center"
      >
        {/* Title */}
        <motion.h1
          initial={{ letterSpacing: '0.1em' }}
          animate={{ letterSpacing: '0.3em' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-display text-4xl md:text-5xl font-normal text-dark mb-6 tracking-widest"
        >
          MEMENTO MORI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-dark text-lg mb-12 font-light"
        >
          Recuerda que morirás
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-24 h-px bg-dark mx-auto mb-12"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-gray-dark mb-8"
        >
          Esta herramienta visualiza las semanas de una vida de 80 años.
          <br />
          Cada cuadro representa una semana.
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="birthDate" className="block text-sm text-gray-dark mb-2">
              ¿Cuándo naciste?
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-3 bg-white border border-gray-subtle rounded-lg
                         text-dark text-center text-lg
                         focus:outline-none focus:border-dark focus:ring-1 focus:ring-dark
                         transition-all duration-200"
              required
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || !birthDate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-dark text-cream rounded-lg font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover:bg-opacity-90"
          >
            {isSubmitting ? 'Cargando...' : 'Comenzar'}
          </motion.button>
        </motion.form>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-xs text-gray-dark mt-8"
        >
          Tu información se guarda únicamente en tu dispositivo.
          <br />
          No recopilamos ningún dato.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
