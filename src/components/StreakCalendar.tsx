
import React from 'react';
import { Habit } from '@/types/habit';
import { getToday, getDaysInMonth, getDatesBetween, isToday, getDayName } from '@/utils/date-utils';
import { cn } from '@/lib/utils';

interface StreakCalendarProps {
  habit: Habit;
  daysToShow?: number;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ habit, daysToShow = 7 }) => {
  const today = new Date();
  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (daysToShow - 1) + i);
    return {
      date: date.toISOString().split('T')[0],
      day: getDayName(date.toISOString()),
      isToday: isToday(date.toISOString().split('T')[0]),
      isCompleted: habit.completedDates.includes(date.toISOString().split('T')[0])
    };
  });

  return (
    <div className="flex mt-4 space-x-2 justify-between">
      {dates.map(({ date, day, isToday, isCompleted }) => (
        <div key={date} className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-1">{day}</span>
          <div 
            className={cn(
              "streak-dot",
              isCompleted ? "streak-dot-completed" : "streak-dot-missed",
              isToday && "streak-dot-today"
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default StreakCalendar;
