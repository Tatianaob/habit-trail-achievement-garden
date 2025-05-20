
import React, { useMemo } from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Activity, Badge, Clock } from 'lucide-react';

interface HabitStatsProps {
  habits: Habit[];
}

const HabitStats: React.FC<HabitStatsProps> = ({ habits }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalHabits = habits.length;
    
    if (totalHabits === 0) {
      return {
        completionRate: 0,
        completedToday: 0,
        totalHabits: 0,
        streakAvg: 0,
        longestStreak: 0
      };
    }
    
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const completionRate = Math.round((completedToday / totalHabits) * 100);
    
    const streaks = habits.map(h => h.streak);
    const streakAvg = Math.round(streaks.reduce((sum, streak) => sum + streak, 0) / totalHabits);
    const longestStreak = Math.max(...streaks);

    return {
      completionRate,
      completedToday,
      totalHabits,
      streakAvg,
      longestStreak
    };
  }, [habits]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {stats.completedToday}/{stats.totalHabits}
          </div>
          <Progress value={stats.completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {stats.completionRate}% completed today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge className="h-4 w-4 text-primary" />
            Total Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalHabits}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Active habits being tracked
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Average Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.streakAvg}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Average consecutive days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Longest Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.longestStreak}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Best consecutive days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitStats;
