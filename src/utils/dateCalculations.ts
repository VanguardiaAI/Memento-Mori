import {
  differenceInWeeks,
  differenceInYears,
  addWeeks,
  addYears,
  startOfWeek,
  format,
  parseISO,
  isValid,
  isFuture,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { LifeStats, WeekInfo, Moment } from '@/types';

export const TOTAL_YEARS = 80;
export const WEEKS_PER_YEAR = 52;
export const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR; // 4160

export function validateBirthDate(dateString: string): { valid: boolean; error?: string } {
  if (!dateString) {
    return { valid: false, error: 'Por favor ingresa tu fecha de nacimiento' };
  }

  const date = parseISO(dateString);

  if (!isValid(date)) {
    return { valid: false, error: 'Fecha inválida' };
  }

  if (isFuture(date)) {
    return { valid: false, error: 'La fecha no puede ser futura' };
  }

  const age = differenceInYears(new Date(), date);

  if (age >= TOTAL_YEARS) {
    return { valid: false, error: `La fecha debe ser de hace menos de ${TOTAL_YEARS} años` };
  }

  if (age < 0) {
    return { valid: false, error: 'Fecha inválida' };
  }

  return { valid: true };
}

export function calculateLifeStats(birthDateString: string): LifeStats {
  const birthDate = parseISO(birthDateString);
  const now = new Date();

  const weeksLived = Math.max(0, differenceInWeeks(now, birthDate));
  const weeksRemaining = Math.max(0, TOTAL_WEEKS - weeksLived);
  const percentageLived = Math.min(100, (weeksLived / TOTAL_WEEKS) * 100);

  const currentWeek = (weeksLived % WEEKS_PER_YEAR) + 1;
  const currentYear = Math.floor(weeksLived / WEEKS_PER_YEAR) + 1;
  const age = differenceInYears(now, birthDate);

  // Calculate weeks until next birthday
  const nextBirthday = addYears(birthDate, age + 1);
  const weeksUntilBirthday = Math.max(0, differenceInWeeks(nextBirthday, now));

  return {
    weeksLived,
    weeksRemaining,
    totalWeeks: TOTAL_WEEKS,
    percentageLived,
    currentWeek,
    currentYear,
    weeksUntilBirthday,
    age,
  };
}

export function getWeekInfo(
  weekNumber: number,
  birthDateString: string,
  moments: Moment[]
): WeekInfo {
  const birthDate = parseISO(birthDateString);
  const now = new Date();

  // weekNumber is 1-indexed (1 to 4160)
  const weekDate = addWeeks(birthDate, weekNumber - 1);
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });

  const weeksLived = differenceInWeeks(now, birthDate);
  const isLived = weekNumber <= weeksLived;
  const isCurrent = weekNumber === weeksLived + 1;

  const year = Math.ceil(weekNumber / WEEKS_PER_YEAR);
  const weekOfYear = ((weekNumber - 1) % WEEKS_PER_YEAR) + 1;

  // Find moment for this week
  const moment = moments.find(m => m.weekNumber === weekNumber);

  return {
    weekNumber,
    year,
    weekOfYear,
    isLived,
    isCurrent,
    moment,
    date: weekStart,
  };
}

export function dateToWeekNumber(birthDateString: string, targetDateString: string): number {
  const birthDate = parseISO(birthDateString);
  const targetDate = parseISO(targetDateString);

  const weeks = differenceInWeeks(targetDate, birthDate);
  return Math.max(1, weeks + 1);
}

export function weekNumberToAge(weekNumber: number): { years: number; weeks: number } {
  const totalWeeks = weekNumber - 1;
  const years = Math.floor(totalWeeks / WEEKS_PER_YEAR);
  const weeks = totalWeeks % WEEKS_PER_YEAR;
  return { years, weeks };
}

export function formatDate(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function getWeeksAgo(weekNumber: number, birthDateString: string): number {
  const birthDate = parseISO(birthDateString);
  const now = new Date();
  const currentWeekNumber = differenceInWeeks(now, birthDate) + 1;
  return currentWeekNumber - weekNumber;
}
