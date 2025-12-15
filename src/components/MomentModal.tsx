'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Moment } from '@/types';
import { formatDate } from '@/utils/dateCalculations';

interface MomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, date: string) => boolean;
  onRemove: (id: string) => void;
  moments: Moment[];
  birthDate: string;
  canAddMore: boolean;
  maxMoments: number;
}

export function MomentModal({
  isOpen,
  onClose,
  onAdd,
  onRemove,
  moments,
  birthDate,
  canAddMore,
  maxMoments,
}: MomentModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'add' | 'list'>('add');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Por favor ingresa un nombre para el momento');
      return;
    }

    if (!date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    // Check if date is in the past
    if (new Date(date) > new Date()) {
      setError('La fecha debe ser en el pasado');
      return;
    }

    // Check if date is after birth date
    if (new Date(date) < new Date(birthDate)) {
      setError('La fecha debe ser posterior a tu nacimiento');
      return;
    }

    const success = onAdd(name.trim(), date);
    if (success) {
      setName('');
      setDate('');
      setView('list');
    } else {
      setError('Ya existe un momento en esa semana o se alcanzó el límite');
    }
  };

  const handleClose = () => {
    setName('');
    setDate('');
    setError(null);
    setView('add');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-dark/50"
          onClick={handleClose}
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
                Momentos especiales
              </h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-dark hover:text-dark transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-subtle">
              <button
                onClick={() => setView('add')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  view === 'add' ? 'text-dark border-b-2 border-dark' : 'text-gray-dark'
                }`}
              >
                Añadir
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  view === 'list' ? 'text-dark border-b-2 border-dark' : 'text-gray-dark'
                }`}
              >
                Mis momentos ({moments.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {view === 'add' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!canAddMore && (
                    <div className="p-3 bg-gold/20 rounded-lg text-sm text-dark">
                      Has alcanzado el límite de {maxMoments} momentos.
                    </div>
                  )}

                  <div>
                    <label htmlFor="momentName" className="block text-sm text-gray-dark mb-1">
                      Nombre del momento
                    </label>
                    <input
                      type="text"
                      id="momentName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Graduación, Boda, Primer trabajo..."
                      maxLength={50}
                      disabled={!canAddMore}
                      className="w-full px-3 py-2 bg-white border border-gray-subtle rounded-lg
                                 text-dark focus:outline-none focus:border-dark
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="momentDate" className="block text-sm text-gray-dark mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="momentDate"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={birthDate}
                      max={new Date().toISOString().split('T')[0]}
                      disabled={!canAddMore}
                      className="w-full px-3 py-2 bg-white border border-gray-subtle rounded-lg
                                 text-dark focus:outline-none focus:border-dark
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-600 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={!canAddMore}
                    className="w-full py-2 bg-gold text-dark rounded-lg font-medium
                               hover:bg-gold-light transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guardar momento
                  </button>

                  <p className="text-xs text-gray-dark text-center">
                    Los momentos aparecerán destacados en dorado en tu cuadrícula
                  </p>
                </form>
              ) : (
                <div className="space-y-2">
                  {moments.length === 0 ? (
                    <div className="text-center py-8 text-gray-dark">
                      <p>No tienes momentos guardados.</p>
                      <p className="text-sm mt-1">
                        Añade momentos importantes de tu vida.
                      </p>
                    </div>
                  ) : (
                    moments
                      .sort((a, b) => a.weekNumber - b.weekNumber)
                      .map((moment) => (
                        <MomentItem
                          key={moment.id}
                          moment={moment}
                          onRemove={onRemove}
                        />
                      ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MomentItemProps {
  moment: Moment;
  onRemove: (id: string) => void;
}

function MomentItem({ moment, onRemove }: MomentItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between p-3 bg-white rounded-lg"
    >
      <div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gold rounded-sm" />
          <span className="font-medium text-dark">{moment.name}</span>
        </div>
        <div className="text-xs text-gray-dark mt-1 ml-5">
          {formatDate(new Date(moment.date))} · Semana {moment.weekNumber}
        </div>
      </div>

      {showConfirm ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRemove(moment.id)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
          >
            Eliminar
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-2 py-1 text-xs bg-gray-subtle text-dark rounded"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 text-gray-dark hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
