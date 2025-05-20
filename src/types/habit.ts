
export type HabitCategory = "health" | "work" | "personal" | "study" | "other";

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: "daily" | "weekly";
  startDate: string; // ISO date string
  streak: number;
  completedDates: string[]; // Array of ISO date strings
  completedToday: boolean;
  iconName?: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
  criteria: {
    type: "streak" | "completions" | "perfectWeek";
    value: number;
    habitId?: string;
  };
};
