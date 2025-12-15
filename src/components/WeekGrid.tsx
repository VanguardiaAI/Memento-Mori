'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Moment, WeekInfo, ViewMode } from '@/types';
import { TOTAL_YEARS, WEEKS_PER_YEAR, TOTAL_WEEKS, getWeekInfo, weekNumberToAge, formatDate, getWeeksAgo, getMomentStats, formatTimeAgo, formatWeekOfMonth } from '@/utils/dateCalculations';

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

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltip && gridRef.current) {
        const target = event.target as Node;
        // Check if click is outside the tooltip area
        const tooltipEl = gridRef.current.querySelector('.tooltip');
        if (tooltipEl && !tooltipEl.contains(target)) {
          // Check if click is on a week cell
          const weekCell = (event.target as Element).closest('.week-cell');
          if (!weekCell) {
            setTooltip(null);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [tooltip]);

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

  // Show tooltip on hover (only in perspective mode)
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
    if (viewMode === 'perspective') {
      setTooltip(null);
    }
  }, [viewMode]);

  // Show tooltip on click/tap (always works)
  const handleWeekClick = useCallback((week: WeekInfo, event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    if (gridRect) {
      // If clicking the same week, toggle off
      if (tooltip?.week.weekNumber === week.weekNumber) {
        setTooltip(null);
      } else {
        setTooltip({
          week,
          x: rect.left - gridRect.left + rect.width / 2,
          y: rect.top - gridRect.top - 10,
        });
      }
    }

    if (onWeekClick) {
      onWeekClick(week);
    }
  }, [tooltip, onWeekClick]);

  // Close tooltip
  const handleCloseTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="relative w-full" ref={gridRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="text-xs text-gray-dark">
          Semanas (1-52) →
        </div>
        <div className="text-xs text-gray-dark">
          Toca cualquier semana para ver detalles
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
                    const isSelected = tooltip?.week.weekNumber === week.weekNumber;

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
                          ${isSelected ? 'ring-2 ring-gold ring-offset-1 ring-offset-cream' : ''}
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
                        onClick={(e) => handleWeekClick(week, e)}
                        onTouchEnd={(e) => handleWeekClick(week, e)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip - now shows on click/tap always */}
      <AnimatePresence>
        {tooltip && (
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
            {/* Close button */}
            <button
              onClick={handleCloseTooltip}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-dark rounded-full flex items-center justify-center text-cream hover:bg-dark transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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

  // Si hay un momento, calcular estadísticas detalladas
  const momentStats = week.moment ? getMomentStats(week.moment.date, birthDate) : null;

  // Si es un momento especial, mostrar tooltip enriquecido
  if (week.moment && momentStats) {
    return (
      <div className="text-center max-w-[280px]">
        {/* Nombre del momento */}
        <div className="text-gold-light font-medium text-base mb-1">
          {week.moment.name}
        </div>
        <div className="text-xs opacity-90 mb-1">
          {formatWeekOfMonth(week.date)}
        </div>
        <div className="text-xs opacity-60 mb-3">
          {formatDate(new Date(week.moment.date))}
        </div>

        {/* Tiempo transcurrido */}
        <div className="bg-cream/10 rounded px-2 py-1.5 mb-2">
          <div className="text-sm font-medium">
            {formatTimeAgo(momentStats.weeksAgo)}
          </div>
          <div className="text-xs opacity-70">
            {momentStats.weeksSinceMoment.toLocaleString('es-ES')} semanas desde entonces
          </div>
        </div>

        {/* Comparativa entonces vs ahora */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div className="bg-cream/10 rounded p-1.5">
            <div className="opacity-60">Entonces</div>
            <div className="font-medium">{momentStats.weeksLivedThen.toLocaleString('es-ES')} sem</div>
            <div className="opacity-60">{momentStats.percentageOfLifeThen.toFixed(1)}% de vida</div>
          </div>
          <div className="bg-cream/10 rounded p-1.5">
            <div className="opacity-60">Ahora</div>
            <div className="font-medium">{momentStats.weeksLivedNow.toLocaleString('es-ES')} sem</div>
            <div className="opacity-60">{momentStats.percentageOfLifeNow.toFixed(1)}% de vida</div>
          </div>
        </div>

        {/* Edad en el momento */}
        <div className="text-xs opacity-80 mb-2">
          Tenías {momentStats.ageAtMoment.years} años
          {momentStats.ageAtMoment.months > 0 ? ` y ${momentStats.ageAtMoment.months} meses` : ''}
        </div>

        {/* Dato curioso */}
        {momentStats.timesLivedSinceThen >= 0.1 && (
          <div className="text-xs italic opacity-70 border-t border-cream/20 pt-2">
            {momentStats.timesLivedSinceThen >= 1
              ? `Has vivido ${momentStats.timesLivedSinceThen.toFixed(1)}x el tiempo que tenías entonces`
              : `El ${(momentStats.percentageOfLifeSinceMoment).toFixed(1)}% de tu vida ha pasado desde este momento`
            }
          </div>
        )}
      </div>
    );
  }

  // Tooltip normal para semanas sin momento
  return (
    <div className="text-center">
      {/* Fecha de la semana - Primera semana de Febrero de 2003 */}
      <div className="font-medium text-gold-light mb-1">
        {formatWeekOfMonth(week.date)}
      </div>

      <div className="text-xs opacity-60 mb-2">
        Semana {week.weekNumber.toLocaleString('es-ES')} de 4,160
      </div>

      <div className="bg-cream/10 rounded px-2 py-1.5 mb-2">
        <div className="text-xs opacity-80">
          Año {week.year} de tu vida · Semana {week.weekOfYear}
        </div>
        <div className="text-xs opacity-80">
          Edad: {years} años{weeks > 0 ? ` y ${weeks} semanas` : ''}
        </div>
      </div>

      {week.isLived && weeksAgo > 0 && (
        <div className="text-xs opacity-60">
          {formatTimeAgo(weeksAgo)}
        </div>
      )}
      {week.isCurrent && (
        <div className="mt-1 text-xs text-gold-light font-medium">
          ← Estás aquí
        </div>
      )}
      {!week.isLived && !week.isCurrent && (
        <div className="text-xs opacity-50 italic">
          Aún por vivir
        </div>
      )}
    </div>
  );
}
