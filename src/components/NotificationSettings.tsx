'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NotificationSettings as NotificationSettingsType } from '@/types';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettingsType;
  onUpdate: (settings: Partial<NotificationSettingsType>) => void;
  weeksLived: number;
  weeksRemaining: number;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function NotificationSettings({
  isOpen,
  onClose,
  settings,
  onUpdate,
  weeksLived,
  weeksRemaining,
}: NotificationSettingsProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showTestNotification, setShowTestNotification] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        onUpdate({ enabled: true });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }, [onUpdate]);

  const sendTestNotification = useCallback(() => {
    if (notificationPermission !== 'granted') return;

    const notification = new Notification('Memento Mori', {
      body: `Semana ${weeksLived + 1} de 4,160. Te quedan ${weeksRemaining} semanas para los 80.`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'memento-mori-test',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setShowTestNotification(true);
    setTimeout(() => setShowTestNotification(false), 3000);
  }, [notificationPermission, weeksLived, weeksRemaining]);

  const handleToggle = useCallback(() => {
    if (!settings.enabled && notificationPermission !== 'granted') {
      requestPermission();
    } else {
      onUpdate({ enabled: !settings.enabled });
    }
  }, [settings.enabled, notificationPermission, requestPermission, onUpdate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 modal-backdrop bg-dark/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-cream rounded-xl shadow-xl overflow-hidden max-h-[calc(100vh-32px)] md:max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-subtle flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-display text-dark tracking-wide">
                Notificaciones
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
            <div className="p-4 space-y-6 flex-1 overflow-y-auto">
              {/* Permission status */}
              {notificationPermission === 'denied' && (
                <div className="p-3 bg-red-100 rounded-lg text-sm text-red-700">
                  Las notificaciones están bloqueadas. Por favor, habilítalas en la configuración de tu navegador.
                </div>
              )}

              {/* Enable toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-dark">Recordatorio semanal</div>
                  <div className="text-sm text-gray-dark">
                    Recibe una notificación sobre tu semana actual
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  disabled={notificationPermission === 'denied'}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${settings.enabled ? 'bg-gold' : 'bg-gray-subtle'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <motion.div
                    animate={{ x: settings.enabled ? 24 : 0 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {settings.enabled && notificationPermission === 'granted' && (
                <>
                  {/* Random toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-dark">Hora aleatoria</div>
                      <div className="text-sm text-gray-dark">
                        Recibe la notificación en un momento aleatorio durante el día
                      </div>
                    </div>
                    <button
                      onClick={() => onUpdate({ isRandom: !settings.isRandom })}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors
                        ${settings.isRandom ? 'bg-gold' : 'bg-gray-subtle'}
                      `}
                    >
                      <motion.div
                        animate={{ x: settings.isRandom ? 24 : 0 }}
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  {!settings.isRandom && (
                    <>
                      {/* Day selector */}
                      <div>
                        <label className="block text-sm text-gray-dark mb-2">
                          Día de la semana
                        </label>
                        <select
                          value={settings.dayOfWeek}
                          onChange={(e) => onUpdate({ dayOfWeek: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white border border-gray-subtle rounded-lg
                                     text-dark focus:outline-none focus:border-dark"
                        >
                          {DAYS.map((day, index) => (
                            <option key={index} value={index}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time selector */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-dark mb-2">
                            Hora
                          </label>
                          <select
                            value={settings.hour}
                            onChange={(e) => onUpdate({ hour: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-subtle rounded-lg
                                       text-dark focus:outline-none focus:border-dark"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm text-gray-dark mb-2">
                            Minutos
                          </label>
                          <select
                            value={settings.minute}
                            onChange={(e) => onUpdate({ minute: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-gray-subtle rounded-lg
                                       text-dark focus:outline-none focus:border-dark"
                          >
                            {[0, 15, 30, 45].map((min) => (
                              <option key={min} value={min}>
                                {min.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Test notification */}
                  <div className="pt-4 border-t border-gray-subtle">
                    <button
                      onClick={sendTestNotification}
                      className="w-full py-2 bg-white border border-gray-subtle rounded-lg
                                 text-dark hover:bg-gray-subtle/20 transition-colors"
                    >
                      {showTestNotification ? '¡Notificación enviada!' : 'Enviar notificación de prueba'}
                    </button>
                  </div>
                </>
              )}

              {/* Info */}
              <p className="text-xs text-gray-dark text-center">
                Las notificaciones funcionan incluso con la app cerrada gracias a Service Workers.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
