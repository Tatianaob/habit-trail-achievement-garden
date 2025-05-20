
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import MonthlyView from '@/components/MonthlyView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { HabitCategory } from '@/types/habit';

const Calendar = () => {
  const { habits } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');

  const selectedHabit = selectedHabitId === 'all' 
    ? null 
    : habits.find(h => h.id === selectedHabitId) || null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        
        <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Habits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Habits</SelectItem>
            {habits.map(habit => (
              <SelectItem key={habit.id} value={habit.id}>
                <div className="flex items-center gap-2">
                  <span 
                    className={`w-2 h-2 rounded-full bg-habit-${habit.category}`} 
                  />
                  {habit.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Monthly View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyView selectedHabit={selectedHabit} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completion by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(Object.keys({
                health: 'Health',
                work: 'Work',
                personal: 'Personal',
                study: 'Study',
                other: 'Other'
              }) as HabitCategory[]).map(category => {
                const categoryHabits = habits.filter(h => h.category === category);
                const total = categoryHabits.length;
                
                if (total === 0) return null;
                
                const completedToday = categoryHabits.filter(h => 
                  h.completedDates.includes(new Date().toISOString().split('T')[0])
                ).length;
                
                const percentage = total > 0 ? Math.round((completedToday / total) * 100) : 0;
                
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-habit-${category}`} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="capitalize">{category}</span>
                        <span>{completedToday}/{total}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary animate-progress-fill origin-left"
                          style={{ transform: `scaleX(${percentage / 100})` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.length > 0 ? (
                [...habits]
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 5)
                  .map(habit => (
                    <div key={habit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-2 h-2 rounded-full bg-habit-${habit.category}`} 
                        />
                        <span>{habit.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No habits tracked yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
