
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitCategory, Achievement } from '../types/habit';
import { getToday, getStreakCount } from '../utils/date-utils';
import { loadHabits, saveHabits, loadAchievements, saveAchievements } from '../utils/storage-utils';
import { useToast } from "@/components/ui/use-toast";

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'achievement-1',
    name: 'Early Bird',
    description: 'Complete your first habit',
    earned: false,
    icon: 'badge',
    criteria: { type: 'completions', value: 1 }
  },
  {
    id: 'achievement-2',
    name: 'Consistent',
    description: 'Reach a 3-day streak on any habit',
    earned: false,
    icon: 'badge-check',
    criteria: { type: 'streak', value: 3 }
  },
  {
    id: 'achievement-3',
    name: 'Dedicated',
    description: 'Reach a 7-day streak on any habit',
    earned: false,
    icon: 'star',
    criteria: { type: 'streak', value: 7 }
  },
  {
    id: 'achievement-4',
    name: 'Habit Master',
    description: 'Reach a 30-day streak on any habit',
    earned: false,
    icon: 'star-half',
    criteria: { type: 'streak', value: 30 }
  },
  {
    id: 'achievement-5',
    name: 'Overachiever',
    description: 'Complete all habits on a single day',
    earned: false,
    icon: 'calendar-days',
    criteria: { type: 'perfectWeek', value: 1 }
  }
];

interface HabitContextType {
  habits: Habit[];
  achievements: Achievement[];
  addHabit: (name: string, category: HabitCategory, frequency: 'daily' | 'weekly') => void;
  editHabit: (id: string, data: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string) => void;
  getHabitsByCategory: (category: HabitCategory) => Habit[];
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const { toast } = useToast();

  useEffect(() => {
    const storedHabits = loadHabits();
    setHabits(storedHabits);
    
    const storedAchievements = loadAchievements();
    setAchievements(storedAchievements.length > 0 ? storedAchievements : defaultAchievements);
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      saveHabits(habits);
      checkAchievements();
    }
  }, [habits]);

  useEffect(() => {
    if (achievements.length > 0) {
      saveAchievements(achievements);
    }
  }, [achievements]);

  const addHabit = (name: string, category: HabitCategory, frequency: 'daily' | 'weekly') => {
    const today = getToday();
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      category,
      frequency,
      startDate: today,
      streak: 0,
      completedDates: [],
      completedToday: false
    };

    setHabits(prev => [...prev, newHabit]);
    toast({
      title: "Habit created",
      description: `${name} has been added to your habits`,
    });
  };

  const editHabit = (id: string, data: Partial<Habit>) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, ...data } : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    if (!habitToDelete) return;
    
    setHabits(prev => prev.filter(habit => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: `${habitToDelete.name} has been removed`,
    });
  };

  const toggleHabitCompletion = (habitId: string) => {
    const today = getToday();
    
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id !== habitId) return habit;
        
        const alreadyCompleted = habit.completedDates.includes(today);
        let newCompletedDates = [...habit.completedDates];
        
        if (alreadyCompleted) {
          newCompletedDates = newCompletedDates.filter(date => date !== today);
        } else {
          newCompletedDates = [...newCompletedDates, today];
        }
        
        const newStreak = getStreakCount(newCompletedDates);
        const completedToday = newCompletedDates.includes(today);
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
          completedToday
        };
      })
    );
  };

  const checkAchievements = () => {
    const newAchievements = [...achievements];
    let achievementEarned = false;

    // Check streak-based achievements
    const maxStreak = Math.max(...habits.map(habit => habit.streak), 0);
    newAchievements.forEach(achievement => {
      if (achievement.earned) return;

      if (achievement.criteria.type === 'streak') {
        if (maxStreak >= achievement.criteria.value) {
          achievement.earned = true;
          achievementEarned = true;
        }
      } else if (achievement.criteria.type === 'completions') {
        const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
        if (totalCompletions >= achievement.criteria.value) {
          achievement.earned = true;
          achievementEarned = true;
        }
      } else if (achievement.criteria.type === 'perfectWeek') {
        const today = getToday();
        const allHabitsCompleted = habits.length > 0 && habits.every(habit => 
          habit.completedDates.includes(today)
        );
        
        if (allHabitsCompleted) {
          achievement.earned = true;
          achievementEarned = true;
        }
      }
    });

    if (achievementEarned) {
      setAchievements(newAchievements);
      const newEarned = newAchievements.find(a => a.earned && !achievements.find(old => old.id === a.id && old.earned));
      if (newEarned) {
        toast({
          title: "Achievement Unlocked!",
          description: `${newEarned.name}: ${newEarned.description}`,
        });
      }
    }
  };

  const getHabitsByCategory = (category: HabitCategory) => {
    return habits.filter(habit => habit.category === category);
  };

  return (
    <HabitContext.Provider value={{
      habits,
      achievements,
      addHabit,
      editHabit,
      deleteHabit,
      toggleHabitCompletion,
      getHabitsByCategory
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
