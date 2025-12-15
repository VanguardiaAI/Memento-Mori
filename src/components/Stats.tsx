'use client';

import { motion } from 'framer-motion';
import type { LifeStats } from '@/types';

interface StatsProps {
  stats: LifeStats;
}

export function Stats({ stats }: StatsProps) {
  const { weeksLived, weeksRemaining, totalWeeks, percentageLived, weeksUntilBirthday, age } = stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-lg font-display text-dark mb-4 tracking-wide">Tu vida en números</h2>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-dark mb-2">
          <span>Vivido</span>
          <span>{percentageLived.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-subtle/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentageLived}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-dark rounded-full"
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem
          label="Semanas vividas"
          value={weeksLived.toLocaleString('es-ES')}
          subtext={`de ${totalWeeks.toLocaleString('es-ES')}`}
        />
        <StatItem
          label="Semanas restantes"
          value={weeksRemaining.toLocaleString('es-ES')}
          subtext="hasta los 80"
        />
        <StatItem
          label="Edad actual"
          value={age.toString()}
          subtext="años"
        />
        <StatItem
          label="Próximo cumpleaños"
          value={weeksUntilBirthday.toString()}
          subtext="semanas"
        />
      </div>
    </motion.div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  subtext: string;
}

function StatItem({ label, value, subtext }: StatItemProps) {
  return (
    <div className="text-center p-3 bg-cream/50 rounded-lg">
      <div className="text-xs text-gray-dark mb-1">{label}</div>
      <div className="text-2xl font-display text-dark">{value}</div>
      <div className="text-xs text-gray-dark">{subtext}</div>
    </div>
  );
}
