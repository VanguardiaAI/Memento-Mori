'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserData, Moment, NotificationSettings, LifeStats } from '@/types';
import { calculateLifeStats, dateToWeekNumber, TOTAL_WEEKS } from '@/utils/dateCalculations';

const MAX_MOMENTS = 20;

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  dayOfWeek: 0, // Sunday
  hour: 9,
  minute: 0,
  isRandom: false,
};

export function useUserData() {
  const [userData, setUserData, removeUserData] = useLocalStorage<UserData | null>(
    'memento-mori-user',
    null
  );

  const [moments, setMoments, removeMoments] = useLocalStorage<Moment[]>(
    'memento-mori-moments',
    []
  );

  const [notificationSettings, setNotificationSettings] = useLocalStorage<NotificationSettings>(
    'memento-mori-notifications',
    defaultNotificationSettings
  );

  // Calculate life stats
  const lifeStats: LifeStats | null = useMemo(() => {
    if (!userData?.birthDate) return null;
    return calculateLifeStats(userData.birthDate);
  }, [userData?.birthDate]);

  // Save user birth date
  const saveBirthDate = useCallback((birthDate: string) => {
    setUserData({
      birthDate,
      createdAt: new Date().toISOString(),
    });
  }, [setUserData]);

  // Add a new moment
  const addMoment = useCallback((name: string, date: string): boolean => {
    if (!userData?.birthDate) return false;
    if (moments.length >= MAX_MOMENTS) return false;

    const weekNumber = dateToWeekNumber(userData.birthDate, date);

    // Don't add if week number is out of range
    if (weekNumber < 1 || weekNumber > TOTAL_WEEKS) return false;

    // Don't add duplicate moments for the same week
    if (moments.some(m => m.weekNumber === weekNumber)) return false;

    const newMoment: Moment = {
      id: `moment-${Date.now()}`,
      name,
      date,
      weekNumber,
      createdAt: new Date().toISOString(),
    };

    setMoments(prev => [...prev, newMoment]);
    return true;
  }, [userData?.birthDate, moments, setMoments]);

  // Remove a moment
  const removeMoment = useCallback((id: string) => {
    setMoments(prev => prev.filter(m => m.id !== id));
  }, [setMoments]);

  // Update notification settings
  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  }, [setNotificationSettings]);

  // Reset all data
  const resetAllData = useCallback(() => {
    removeUserData();
    removeMoments();
    setNotificationSettings(defaultNotificationSettings);
  }, [removeUserData, removeMoments, setNotificationSettings]);

  return {
    userData,
    moments,
    notificationSettings,
    lifeStats,
    isOnboarded: !!userData?.birthDate,
    saveBirthDate,
    addMoment,
    removeMoment,
    updateNotificationSettings,
    resetAllData,
    canAddMoreMoments: moments.length < MAX_MOMENTS,
    momentsCount: moments.length,
    maxMoments: MAX_MOMENTS,
  };
}
