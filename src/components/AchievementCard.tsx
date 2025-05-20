
import React from 'react';
import { Achievement } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge, BadgeCheck, Star, StarHalf, CalendarDays } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getAchievementIcon = () => {
    switch (achievement.icon) {
      case 'badge':
        return <Badge className="h-6 w-6" />;
      case 'badge-check':
        return <BadgeCheck className="h-6 w-6" />;
      case 'star':
        return <Star className="h-6 w-6" />;
      case 'star-half':
        return <StarHalf className="h-6 w-6" />;
      case 'calendar-days':
        return <CalendarDays className="h-6 w-6" />;
      default:
        return <Badge className="h-6 w-6" />;
    }
  };
  
  return (
    <Card className={cn(
      "transition-all border overflow-hidden",
      achievement.earned 
        ? "bg-gradient-to-br from-secondary to-secondary/50 border-primary/30" 
        : "opacity-60 grayscale"
    )}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          achievement.earned 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {getAchievementIcon()}
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium">{achievement.name}</h3>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
