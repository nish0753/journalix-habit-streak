
import React from 'react';
import { Award, BookOpen, Calendar, CheckCircle, Sunrise } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types';
import { Progress } from '@/components/ui/progress';

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ achievements }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="h-5 w-5" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5" />;
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5" />;
      case 'Sunrise':
        return <Sunrise className="h-5 w-5" />;
      case 'Calendar':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => {
        const isEarned = !!achievement.earnedAt;
        const progress = achievement.progress || 0;
        const maxProgress = achievement.maxProgress || 1;
        const progressPercentage = Math.min(Math.round((progress / maxProgress) * 100), 100);
        
        return (
          <div 
            key={achievement.id} 
            className={cn(
              "p-4 rounded-lg border border-border transition-all",
              isEarned ? "bg-primary/5" : "bg-card"
            )}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isEarned ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              )}>
                {getIcon(achievement.icon)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{achievement.name}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}/{maxProgress}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
                
                {isEarned && (
                  <p className="text-xs text-primary mt-2">
                    Earned on {achievement.earnedAt?.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementBadges;
