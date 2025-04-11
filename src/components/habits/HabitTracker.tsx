
import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import HabitStreaks from './HabitStreaks';
import { Habit } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchUserHabits, toggleHabitCompletion } from '@/services/habitService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HabitFormModal from './HabitFormModal';

const HabitTracker: React.FC<{ limit?: number }> = ({ limit }) => {
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch habits with React Query
  const { data: habits, isLoading, error } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: () => user ? fetchUserHabits(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  // Toggle habit completion mutation
  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      return toggleHabitCompletion(habitId, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update habit",
        variant: "destructive"
      });
    }
  });

  const handleToggleHabit = (habitId: string, isCompleted: boolean) => {
    toggleHabitMutation.mutate({ 
      habitId, 
      completed: !isCompleted 
    });
    
    toast({
      description: !isCompleted 
        ? "Habit marked as complete for today!" 
        : "Habit marked as incomplete for today",
    });
  };

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date();
    return habit.completedDates.some(date => 
      date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear()
    );
  };
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm p-8">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-center mt-4">Loading habits...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm p-8">
        <p className="text-center text-destructive">Failed to load habits</p>
      </div>
    );
  }

  // Apply limit if provided
  const displayedHabits = limit ? habits?.slice(0, limit) : habits;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Habit Tracker</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddHabitModalOpen(true)}
            >
              <Plus size={16} className="mr-1" />
              Add Habit
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {displayedHabits && displayedHabits.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {displayedHabits.map(habit => (
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
                      onClick={() => handleToggleHabit(habit.id, isHabitCompletedToday(habit))}
                      disabled={toggleHabitMutation.isPending}
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
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any habits yet.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddHabitModalOpen(true)}
            >
              <Plus size={16} className="mr-1" />
              Add Your First Habit
            </Button>
          </div>
        )}
      </div>
      
      <HabitFormModal 
        isOpen={isAddHabitModalOpen} 
        onClose={() => setIsAddHabitModalOpen(false)} 
      />
    </div>
  );
};

export default HabitTracker;
