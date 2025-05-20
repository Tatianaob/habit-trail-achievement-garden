
import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import HabitStats from '@/components/HabitStats';
import HabitItem from '@/components/HabitItem';
import HabitForm from '@/components/HabitForm';
import MonthlyView from '@/components/MonthlyView';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const { habits } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  
  const todaysHabits = habits.filter(h => h.frequency === "daily").slice(0, 5);

  return (
    <div className="flex flex-col p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>
      
      <HabitStats habits={habits} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <Button variant="link" onClick={() => setFormOpen(true)}>
              View All
            </Button>
          </div>
          
          {todaysHabits.length > 0 ? (
            todaysHabits.map((habit) => (
              <HabitItem 
                key={habit.id} 
                habit={habit} 
                onEdit={() => {
                  setSelectedHabit(habit.id);
                  setFormOpen(true);
                }} 
              />
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No habits tracked yet</p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
          <MonthlyView />
        </div>
      </div>
      
      <HabitForm 
        isOpen={formOpen} 
        onClose={() => {
          setFormOpen(false);
          setSelectedHabit(null);
        }}
        habit={selectedHabit ? habits.find(h => h.id === selectedHabit) : undefined}
      />
    </div>
  );
};

export default Dashboard;
