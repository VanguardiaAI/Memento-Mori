'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Moment, WeekInfo, ViewMode } from '@/types';
import { TOTAL_YEARS, WEEKS_PER_YEAR, TOTAL_WEEKS, getWeekInfo, weekNumberToAge, formatDate, getWeeksAgo } from '@/utils/dateCalculations';

interface WeekGridProps {
  birthDate: string;
  moments: Moment[];
  viewMode: ViewMode;
  onWeekClick?: (week: WeekInfo) => void;
}

interface TooltipData {
  week: WeekInfo;
  x: number;
  y: number;
}

const YEARS_PER_GROUP = 10; // Separación cada 10 años

export function WeekGrid({ birthDate, moments, viewMode, onWeekClick }: WeekGridProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Mark animation as complete after initial load
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Pre-calculate all week info for performance
  const weeksData = useMemo(() => {
    const data: WeekInfo[] = [];
    for (let i = 1; i <= TOTAL_WEEKS; i++) {
      data.push(getWeekInfo(i, birthDate, moments));
    }
    return data;
  }, [birthDate, moments]);

  // Get weeks lived for animation delay calculation
  const weeksLived = useMemo(() => {
    return weeksData.filter(w => w.isLived).length;
  }, [weeksData]);

  // Group weeks by year
  const yearGroups = useMemo(() => {
    const groups: WeekInfo[][] = [];
    for (let year = 0; year < TOTAL_YEARS; year++) {
      const startIndex = year * WEEKS_PER_YEAR;
      groups.push(weeksData.slice(startIndex, startIndex + WEEKS_PER_YEAR));
    }
    return groups;
  }, [weeksData]);

  const handleWeekHover = useCallback((week: WeekInfo, event: React.MouseEvent) => {
    if (viewMode !== 'perspective') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    if (gridRect) {
      setTooltip({
        week,
        x: rect.left - gridRect.left + rect.width / 2,
        y: rect.top - gridRect.top - 10,
      });
    }
  }, [viewMode]);

  const handleWeekLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback((week: WeekInfo) => {
    if (onWeekClick) {
      onWeekClick(week);
    }
  }, [onWeekClick]);

  return (
    <div className="relative w-full" ref={gridRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="text-xs text-gray-dark">
          Semanas (1-52) →
        </div>
      </div>

      {/* Grid container */}
      <div className="grid-container overflow-x-auto pb-4">
        <div className="flex">
          {/* Year labels column */}
          <div className="flex flex-col mr-2 flex-shrink-0">
            {Array.from({ length: TOTAL_YEARS }, (_, i) => i + 1).map((year) => {
              const isGroupEnd = year % YEARS_PER_GROUP === 0 && year < TOTAL_YEARS;
              return (
                <div
                  key={year}
                  className="h-[5px] md:h-[6px] flex items-center justify-end pr-1"
                  style={{
                    marginBottom: isGroupEnd ? '8px' : '1px'
                  }}
                >
                  {year % 10 === 0 && (
                    <span className="text-[8px] md:text-[10px] text-gray-dark font-medium">
                      {year}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Weeks grid - rendered by year groups */}
          <div className="flex flex-col">
            {yearGroups.map((yearWeeks, yearIndex) => {
              const isGroupEnd = (yearIndex + 1) % YEARS_PER_GROUP === 0 && yearIndex < TOTAL_YEARS - 1;

              return (
                <div
                  key={yearIndex}
                  className="flex gap-[1px]"
                  style={{ marginBottom: isGroupEnd ? '8px' : '1px' }}
                >
                  {yearWeeks.map((week) => {
                    const isMoment = !!week.moment;
                    const baseDelay = hasAnimated ? 0 : Math.min(week.weekNumber / weeksLived, 1) * 1.5;

                    return (
                      <motion.div
                        key={week.weekNumber}
                        initial={!hasAnimated && week.isLived ? { backgroundColor: 'transparent' } : undefined}
                        animate={week.isLived ? { backgroundColor: isMoment ? '#c9a227' : '#1a1a1a' } : undefined}
                        transition={!hasAnimated ? { delay: baseDelay, duration: 0.1 } : undefined}
                        className={`
                          week-cell
                          w-[5px] h-[5px] md:w-[6px] md:h-[6px]
                          cursor-pointer
                          ${week.isLived
                            ? isMoment
                              ? 'bg-gold'
                              : 'bg-dark'
                            : week.isCurrent
                              ? 'bg-gray-dark'
                              : 'bg-transparent border border-gray-subtle/60'
                          }
                        `}
                        onMouseEnter={(e) => handleWeekHover(week, e)}
                        onMouseLeave={handleWeekLeave}
                        onClick={() => handleClick(week)}
                        title={viewMode !== 'perspective' ? undefined : ''}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && viewMode === 'perspective' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <WeekTooltip week={tooltip.week} birthDate={birthDate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface WeekTooltipProps {
  week: WeekInfo;
  birthDate: string;
}

function WeekTooltip({ week, birthDate }: WeekTooltipProps) {
  const { years, weeks } = weekNumberToAge(week.weekNumber);
  const weeksAgo = getWeeksAgo(week.weekNumber, birthDate);

  return (
    <div className="text-center">
      <div className="font-medium">Semana {week.weekNumber} de 4,160</div>
      <div className="text-xs opacity-80">
        Año {week.year} · Semana {week.weekOfYear}
      </div>
      <div className="text-xs opacity-80">
        Edad: {years} años{weeks > 0 ? ` y ${weeks} semanas` : ''}
      </div>
      {week.isLived && weeksAgo > 0 && (
        <div className="text-xs opacity-60 mt-1">
          Hace {weeksAgo} semanas
        </div>
      )}
      {week.moment && (
        <div className="mt-2 pt-2 border-t border-cream/30">
          <div className="text-gold-light font-medium">{week.moment.name}</div>
          <div className="text-xs opacity-80">{formatDate(new Date(week.moment.date))}</div>
        </div>
      )}
      {week.isCurrent && (
        <div className="mt-1 text-xs text-gold-light font-medium">
          ← Semana actual
        </div>
      )}
    </div>
  );
}
