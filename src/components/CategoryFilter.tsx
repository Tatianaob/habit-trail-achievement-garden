
import React from 'react';
import { HabitCategory } from '@/types/habit';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: { value: HabitCategory; label: string }[];
  selectedCategory: HabitCategory | "all";
  onChange: (category: HabitCategory | "all") => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={cn(
          "px-3 py-1 text-sm rounded-full transition-colors",
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
        onClick={() => onChange("all")}
      >
        All
      </button>
      
      {categories.map(category => (
        <button
          key={category.value}
          className={cn(
            "px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-2",
            selectedCategory === category.value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
          onClick={() => onChange(category.value)}
        >
          <span 
            className={cn(
              "w-2 h-2 rounded-full", 
              `bg-habit-${category.value}`
            )}
          />
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
