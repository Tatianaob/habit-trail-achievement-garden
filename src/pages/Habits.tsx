import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import HabitItem from '@/components/HabitItem';
import StreakCalendar from '@/components/StreakCalendar';
import HabitForm from '@/components/HabitForm';
import CategoryFilter from '@/components/CategoryFilter';
import { HabitCategory } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Plus, SortAsc, SortDesc } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: HabitCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'study', label: 'Study' },
  { value: 'other', label: 'Other' },
];

const sortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'streak-desc', label: 'Highest Streak' },
  { value: 'streak-asc', label: 'Lowest Streak' },
];

const Habits = () => {
  const { habits } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const filteredHabits = habits
    .filter(habit => selectedCategory === 'all' || habit.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'streak-desc') return b.streak - a.streak;
      if (sortBy === 'streak-asc') return a.streak - b.streak;
      return 0;
    });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Habits</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {sortBy.includes('asc') ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={cn(sortBy === option.value && 'bg-accent text-accent-foreground')}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredHabits.length > 0 ? (
        <div className="space-y-6">
          {filteredHabits.map(habit => (
            <div key={habit.id}>
              <HabitItem
                habit={habit}
                onEdit={() => {
                  setSelectedHabit(habit.id);
                  setFormOpen(true);
                }}
              />
              <StreakCalendar habit={habit} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          {habits.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-4">No habits tracked yet</p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">No habits in this category</p>
            </>
          )}
        </div>
      )}

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

export default Habits;
