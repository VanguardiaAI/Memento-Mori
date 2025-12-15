'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Onboarding } from '@/components/Onboarding';
import { Header } from '@/components/Header';
import { WeekGrid } from '@/components/WeekGrid';
import { Stats } from '@/components/Stats';
import { FloatingButton } from '@/components/FloatingButton';
import { MomentModal } from '@/components/MomentModal';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Disclaimer } from '@/components/Disclaimer';
import { useUserData } from '@/hooks/useUserData';
import type { ViewMode, WeekInfo } from '@/types';

export default function Home() {
  const {
    userData,
    moments,
    notificationSettings,
    lifeStats,
    isOnboarded,
    saveBirthDate,
    addMoment,
    removeMoment,
    updateNotificationSettings,
    resetAllData,
    canAddMoreMoments,
    maxMoments,
  } = useUserData();

  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [showMomentModal, setShowMomentModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Check if user is onboarded
  useEffect(() => {
    // Give localStorage time to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Register service worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Service Worker registered:', registration.scope);
        },
        (error) => {
          console.log('Service Worker registration failed:', error);
        }
      );
    }
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback((birthDate: string) => {
    saveBirthDate(birthDate);
    // Optionally show notification settings after onboarding
    setTimeout(() => {
      setShowNotificationSettings(true);
    }, 1000);
  }, [saveBirthDate]);

  // Handle week click in perspective mode
  const handleWeekClick = useCallback((week: WeekInfo) => {
    if (viewMode === 'perspective') {
      // Could show more details or allow adding moments from here
      console.log('Week clicked:', week);
    }
  }, [viewMode]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    resetAllData();
    setShowResetConfirm(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 100);
  }, [showResetConfirm, resetAllData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-dark tracking-widest">
            MEMENTO MORI
          </h1>
          <p className="text-gray-dark mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (!isOnboarded) {
    return (
      <AnimatePresence mode="wait">
        <Onboarding key="onboarding" onComplete={handleOnboardingComplete} />
      </AnimatePresence>
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSettings={() => setShowNotificationSettings(true)}
        onOpenDisclaimer={() => setShowDisclaimer(true)}
        onReset={handleReset}
      />

      {/* Reset confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50">
          <div className="bg-cream rounded-xl p-6 max-w-sm w-full text-center">
            <h3 className="font-display text-lg text-dark mb-2">
              ¿Reiniciar todos los datos?
            </h3>
            <p className="text-gray-dark text-sm mb-4">
              Esta acción eliminará tu fecha de nacimiento, momentos y configuración.
              No se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 border border-gray-subtle rounded-lg text-dark
                           hover:bg-gray-subtle/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg
                           hover:bg-red-600 transition-colors"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 pb-24">
        {/* Week Grid */}
        {userData?.birthDate && (
          <div className="max-w-4xl mx-auto">
            <WeekGrid
              birthDate={userData.birthDate}
              moments={moments}
              viewMode={viewMode}
              onWeekClick={handleWeekClick}
            />
          </div>
        )}

        {/* Stats */}
        {lifeStats && (
          <div className="max-w-md mx-auto mt-8">
            <Stats stats={lifeStats} />
          </div>
        )}

        {/* Perspective mode hint */}
        {viewMode === 'perspective' && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-dark text-cream px-4 py-2 rounded-lg text-sm shadow-lg">
            Pasa el cursor sobre los cuadros para ver detalles
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-cream/95 border-t border-gray-subtle py-2 px-4 text-center">
        <button
          onClick={() => setShowDisclaimer(true)}
          className="text-xs text-gray-dark hover:text-dark transition-colors"
        >
          Esta herramienta es una reflexión, no una predicción. Ver aviso importante.
        </button>
      </footer>

      {/* Floating action button */}
      <FloatingButton
        onClick={() => setShowMomentModal(true)}
        canAddMore={canAddMoreMoments}
      />

      {/* Modals */}
      <AnimatePresence>
        {showMomentModal && userData?.birthDate && (
          <MomentModal
            isOpen={showMomentModal}
            onClose={() => setShowMomentModal(false)}
            onAdd={addMoment}
            onRemove={removeMoment}
            moments={moments}
            birthDate={userData.birthDate}
            canAddMore={canAddMoreMoments}
            maxMoments={maxMoments}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotificationSettings && lifeStats && (
          <NotificationSettings
            isOpen={showNotificationSettings}
            onClose={() => setShowNotificationSettings(false)}
            settings={notificationSettings}
            onUpdate={updateNotificationSettings}
            weeksLived={lifeStats.weeksLived}
            weeksRemaining={lifeStats.weeksRemaining}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDisclaimer && (
          <Disclaimer
            isOpen={showDisclaimer}
            onClose={() => setShowDisclaimer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
