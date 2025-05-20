
import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import AchievementCard from '@/components/AchievementCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

const Achievements = () => {
  const { achievements, habits } = useHabits();
  
  const earnedCount = achievements.filter(a => a.earned).length;
  const earnedPercentage = Math.round((earnedCount / achievements.length) * 100);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">Complete habits to unlock achievements.</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              {earnedCount} of {achievements.length} Unlocked
            </span>
            <span className="text-sm font-medium">{earnedPercentage}%</span>
          </div>
          <Progress value={earnedPercentage} className="h-2" />
        </CardContent>
      </Card>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {achievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
      
      {habits.length === 0 && (
        <div className="mt-8 p-4 text-center border border-dashed rounded-lg">
          <p className="text-muted-foreground">Start tracking habits to earn achievements!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
