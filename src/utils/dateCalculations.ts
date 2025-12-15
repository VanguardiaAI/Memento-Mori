import {
  differenceInWeeks,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addWeeks,
  addYears,
  startOfWeek,
  startOfMonth,
  format,
  getYear,
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

export interface MomentStats {
  // Tiempo transcurrido desde el momento
  yearsAgo: number;
  monthsAgo: number;
  weeksAgo: number;
  daysAgo: number;

  // Semanas en ese momento vs ahora
  weeksLivedThen: number;
  weeksLivedNow: number;
  weeksSinceMoment: number;

  // Porcentajes de vida
  percentageOfLifeThen: number;
  percentageOfLifeNow: number;

  // Edad en el momento
  ageAtMoment: { years: number; months: number };

  // Datos curiosos
  percentageOfLifeSinceMoment: number; // qué % de tu vida ha pasado desde ese momento
  timesLivedSinceThen: number; // cuántas veces has vivido esa cantidad de tiempo desde entonces
}

export function getMomentStats(momentDate: string, birthDateString: string): MomentStats {
  const birthDate = parseISO(birthDateString);
  const momentDateParsed = parseISO(momentDate);
  const now = new Date();

  // Tiempo transcurrido desde el momento
  const yearsAgo = differenceInYears(now, momentDateParsed);
  const monthsAgo = differenceInMonths(now, momentDateParsed);
  const weeksAgo = differenceInWeeks(now, momentDateParsed);
  const daysAgo = differenceInDays(now, momentDateParsed);

  // Semanas vividas entonces y ahora
  const weeksLivedThen = differenceInWeeks(momentDateParsed, birthDate);
  const weeksLivedNow = differenceInWeeks(now, birthDate);
  const weeksSinceMoment = weeksLivedNow - weeksLivedThen;

  // Porcentajes de vida (de 4160 semanas)
  const percentageOfLifeThen = (weeksLivedThen / TOTAL_WEEKS) * 100;
  const percentageOfLifeNow = (weeksLivedNow / TOTAL_WEEKS) * 100;

  // Edad en el momento
  const yearsAtMoment = differenceInYears(momentDateParsed, birthDate);
  const monthsAtMoment = differenceInMonths(momentDateParsed, birthDate) % 12;

  // Qué porcentaje de tu vida total ha transcurrido desde ese momento
  const percentageOfLifeSinceMoment = (weeksSinceMoment / TOTAL_WEEKS) * 100;

  // Cuántas veces has vivido esa cantidad de tiempo desde entonces
  // (si tenías 10 años y han pasado 20, has vivido 2x ese tiempo)
  const timesLivedSinceThen = weeksLivedThen > 0 ? weeksSinceMoment / weeksLivedThen : 0;

  return {
    yearsAgo,
    monthsAgo,
    weeksAgo,
    daysAgo,
    weeksLivedThen,
    weeksLivedNow,
    weeksSinceMoment,
    percentageOfLifeThen,
    percentageOfLifeNow,
    ageAtMoment: { years: yearsAtMoment, months: monthsAtMoment },
    percentageOfLifeSinceMoment,
    timesLivedSinceThen,
  };
}

export function formatTimeAgo(weeksAgo: number): string {
  if (weeksAgo < 4) {
    return `hace ${weeksAgo} semana${weeksAgo !== 1 ? 's' : ''}`;
  }

  const months = Math.floor(weeksAgo / 4.33);
  if (months < 12) {
    return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `hace ${years} año${years !== 1 ? 's' : ''}`;
  }

  return `hace ${years} año${years !== 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`;
}

const WEEK_ORDINALS = [
  'Primera',
  'Segunda',
  'Tercera',
  'Cuarta',
  'Quinta',
];

export function formatWeekOfMonth(date: Date): string {
  const monthStart = startOfMonth(date);
  const weekOfMonth = Math.ceil((date.getDate() + monthStart.getDay()) / 7);
  const monthName = format(date, 'MMMM', { locale: es });
  const year = getYear(date);

  // Capitalizar el mes
  const monthCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const ordinal = WEEK_ORDINALS[Math.min(weekOfMonth - 1, 4)] || `Semana ${weekOfMonth}`;

  return `${ordinal} semana de ${monthCapitalized} de ${year}`;
}

export function formatWeekOfMonthShort(date: Date): string {
  const monthStart = startOfMonth(date);
  const weekOfMonth = Math.ceil((date.getDate() + monthStart.getDay()) / 7);
  const monthName = format(date, 'MMMM', { locale: es });

  const monthCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const ordinal = WEEK_ORDINALS[Math.min(weekOfMonth - 1, 4)] || `${weekOfMonth}ª`;

  return `${ordinal} sem. de ${monthCapitalized}`;
}
