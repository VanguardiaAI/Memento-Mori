export interface UserData {
  birthDate: string; // ISO date string
  createdAt: string;
}

export interface Moment {
  id: string;
  name: string;
  date: string; // ISO date string
  weekNumber: number; // absolute week number from birth
  createdAt: string;
}

export interface NotificationSettings {
  enabled: boolean;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  minute: number; // 0-59
  isRandom: boolean;
}

export interface WeekInfo {
  weekNumber: number; // 1-4160
  year: number; // 1-80
  weekOfYear: number; // 1-52
  isLived: boolean;
  isCurrent: boolean;
  moment?: Moment;
  date: Date;
}

export interface LifeStats {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentageLived: number;
  currentWeek: number;
  currentYear: number;
  weeksUntilBirthday: number;
  age: number;
}

export type ViewMode = 'default' | 'perspective';
