
import React from 'react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { getToday } from '@/utils/date-utils';
import { CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HabitItemProps {
  habit: Habit;
  onEdit: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onEdit }) => {
  const { toggleHabitCompletion, deleteHabit } = useHabits();
  const today = getToday();
  const isCompletedToday = habit.completedDates.includes(today);
  
  return (
    <div className={cn(
      "flex items-center justify-between p-4 mb-3 rounded-lg transition-all",
      "border border-border bg-card animate-fade-in",
      isCompletedToday && "bg-secondary/50"
    )}>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full w-10 h-10",
            isCompletedToday ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => toggleHabitCompletion(habit.id)}
        >
          {isCompletedToday ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </Button>
        
        <div>
          <h3 className="font-medium">{habit.name}</h3>
          <div className="flex items-center space-x-2">
            <div 
              className={cn(
                "w-2 h-2 rounded-full", 
                `bg-habit-${habit.category}`
              )}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {habit.category}
            </span>
            {habit.streak > 0 && (
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
              </span>
            )}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive" 
            onClick={() => deleteHabit(habit.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HabitItem;
