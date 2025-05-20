
import { Habit, Achievement } from '../types/habit';
import { getStreakCount } from './date-utils';

const HABITS_STORAGE_KEY = 'habitTracker_habits';
const ACHIEVEMENTS_STORAGE_KEY = 'habitTracker_achievements';

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
};

export const loadHabits = (): Habit[] => {
  const stored = localStorage.getItem(HABITS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const habits = JSON.parse(stored) as Habit[];
    
    // Update streak counts
    return habits.map(habit => ({
      ...habit,
      streak: getStreakCount(habit.completedDates)
    }));
  } catch (e) {
    console.error("Error loading habits:", e);
    return [];
  }
};

export const saveAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
};

export const loadAchievements = (): Achievement[] => {
  const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as Achievement[];
  } catch (e) {
    console.error("Error loading achievements:", e);
    return [];
  }
};
