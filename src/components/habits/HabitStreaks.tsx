
import React from 'react';
import { cn } from '@/lib/utils';
import { Habit } from '@/types';

interface HabitStreaksProps {
  habit: Habit;
}

const HabitStreaks: React.FC<HabitStreaksProps> = ({ habit }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Get the current date
  const today = new Date();
  
  // Generate the last 7 days (for a weekly view)
  const generateLastSevenDays = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };
  
  const lastSevenDays = generateLastSevenDays();
  
  // Check if a habit was completed on a specific date
  const isCompletedOnDate = (date: Date) => {
    return habit.completedDates.some(completedDate => 
      completedDate.getDate() === date.getDate() &&
      completedDate.getMonth() === date.getMonth() &&
      completedDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="flex items-center justify-between">
      {lastSevenDays.map((date, index) => {
        const isCompleted = isCompletedOnDate(date);
        const isToday = date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();
        
        return (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={cn(
                "streak-dot",
                isCompleted ? "streak-dot-active" : "streak-dot-inactive",
                isToday && !isCompleted && "border-2 border-primary",
                isCompleted && { backgroundColor: habit.color }
              )}
            >
              {isCompleted ? '✓' : ''}
            </div>
            <span className="text-xs mt-1 text-muted-foreground">
              {days[date.getDay() === 0 ? 6 : date.getDay() - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HabitStreaks;
