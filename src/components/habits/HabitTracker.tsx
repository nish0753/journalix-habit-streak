
import React, { useState } from 'react';
import { Plus, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { habits } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import HabitStreaks from './HabitStreaks';
import { Habit } from '@/types';

const HabitTracker: React.FC = () => {
  const [userHabits, setUserHabits] = useState(habits);
  const { toast } = useToast();

  const toggleHabitCompletion = (habitId: string) => {
    setUserHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const today = new Date();
          const isAlreadyCompleted = habit.completedDates.some(date => 
            date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()
          );
          
          let updatedDates;
          if (isAlreadyCompleted) {
            updatedDates = habit.completedDates.filter(date => 
              !(date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear())
            );
            toast({
              description: `"${habit.name}" marked as incomplete for today`,
            });
          } else {
            updatedDates = [...habit.completedDates, new Date()];
            toast({
              description: `"${habit.name}" completed for today!`,
            });
          }
          
          return {
            ...habit,
            completedDates: updatedDates
          };
        }
        return habit;
      })
    );
  };

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date();
    return habit.completedDates.some(date => 
      date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Habit Tracker</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" />
              Add Habit
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {userHabits.map(habit => (
            <div 
              key={habit.id} 
              className={cn(
                "group p-3 rounded-lg border border-border hover:border-primary/50 transition-all",
                isHabitCompletedToday(habit) && "bg-primary/5"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 rounded-full",
                      isHabitCompletedToday(habit) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                    )}
                    onClick={() => toggleHabitCompletion(habit.id)}
                  >
                    <CheckCircle2 size={18} className={isHabitCompletedToday(habit) ? "fill-primary/20" : ""} />
                  </Button>
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    <p className="text-xs text-muted-foreground">{habit.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
              
              <div className="pl-10">
                <HabitStreaks habit={habit} />
                <div className="flex items-center mt-2">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {habit.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
