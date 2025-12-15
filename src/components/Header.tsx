'use client';

import { motion } from 'framer-motion';
import type { ViewMode } from '@/types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenSettings: () => void;
  onOpenDisclaimer: () => void;
  onReset: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  onOpenSettings,
  onOpenDisclaimer,
  onReset,
}: HeaderProps) {
  return (
    <header className="relative py-6 px-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl md:text-4xl font-normal text-dark tracking-widest"
      >
        MEMENTO MORI
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-gray-dark text-sm mt-1"
      >
        Recuerda que morirás
      </motion.p>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* View mode toggle */}
        <button
          onClick={() => onViewModeChange(viewMode === 'default' ? 'perspective' : 'default')}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${viewMode === 'perspective'
              ? 'bg-dark text-cream'
              : 'bg-white/50 text-dark hover:bg-white/80'}
          `}
        >
          {viewMode === 'perspective' ? 'Modo Perspectiva ✓' : 'Modo Perspectiva'}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-white/50 text-dark hover:bg-white/80 transition-colors"
          title="Notificaciones"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Menu button */}
        <div className="relative group">
          <button
            className="p-2 rounded-lg bg-white/50 text-dark hover:bg-white/80 transition-colors"
            title="Menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={onOpenDisclaimer}
              className="w-full px-4 py-2 text-left text-sm text-dark hover:bg-gray-subtle/30 transition-colors"
            >
              Aviso importante
            </button>
            <button
              onClick={onReset}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Reiniciar datos
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
