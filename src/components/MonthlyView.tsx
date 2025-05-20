
import React, { useState, useMemo } from 'react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/contexts/HabitContext';
import { getToday, getDaysInMonth, getMonthName } from '@/utils/date-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyViewProps {
  selectedHabit?: Habit | null;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedHabit }) => {
  const { habits } = useHabits();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  
  const navigateMonth = (dir: 'prev' | 'next') => {
    if (dir === 'prev') {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    }
  };

  const habitsToShow = useMemo(() => {
    if (selectedHabit) return [selectedHabit];
    return habits;
  }, [habits, selectedHabit]);

  const habitCompletions = useMemo(() => {
    const completions: Record<string, string[]> = {};
    
    habitsToShow.forEach(habit => {
      habit.completedDates.forEach(date => {
        const dateObj = new Date(date);
        if (dateObj.getMonth() === viewMonth && dateObj.getFullYear() === viewYear) {
          const day = dateObj.getDate().toString();
          if (!completions[day]) completions[day] = [];
          completions[day].push(habit.id);
        }
      });
    });
    
    return completions;
  }, [habitsToShow, viewMonth, viewYear]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{getMonthName(viewMonth)} {viewYear}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="font-medium text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before first of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}
          
          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const todayStr = getToday();
            const isToday = dateStr === todayStr;
            const completedHabits = habitCompletions[day] || [];
            const completionRate = habitsToShow.length > 0 
              ? completedHabits.length / habitsToShow.length 
              : 0;
            
            const getBgColor = () => {
              if (completionRate === 0) return "bg-transparent";
              if (completionRate < 0.5) return "bg-primary/20";
              if (completionRate < 1) return "bg-primary/50";
              return "bg-primary";
            };
            
            return (
              <div
                key={day}
                className={cn(
                  "h-8 flex items-center justify-center rounded-full text-sm relative",
                  getBgColor(),
                  isToday && "ring-2 ring-primary",
                )}
              >
                {day}
                {completedHabits.length > 0 && !selectedHabit && (
                  <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-sm bg-transparent border border-muted-foreground/30"></div>
            <span>No habits</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-sm bg-primary"></div>
            <span>All completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyView;
