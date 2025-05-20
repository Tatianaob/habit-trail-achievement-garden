
import React, { useState, useEffect } from "react";
import { useHabits } from "@/contexts/HabitContext";
import { Habit, HabitCategory } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit;
}

const CATEGORIES: { value: HabitCategory; label: string }[] = [
  { value: "health", label: "Health" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "study", label: "Study" },
  { value: "other", label: "Other" },
];

const HabitForm: React.FC<HabitFormProps> = ({ isOpen, onClose, habit }) => {
  const { addHabit, editHabit } = useHabits();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<HabitCategory>("health");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setCategory(habit.category);
      setFrequency(habit.frequency);
    } else {
      setName("");
      setCategory("health");
      setFrequency("daily");
    }
  }, [habit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (habit) {
      editHabit(habit.id, { name, category, frequency });
    } else {
      addHabit(name, category, frequency);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{habit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Meditation"
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as HabitCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-habit-${cat.value}`} />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(value) => setFrequency(value as "daily" | "weekly")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{habit ? "Save Changes" : "Create Habit"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
