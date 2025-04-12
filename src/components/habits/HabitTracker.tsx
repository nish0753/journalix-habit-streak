
import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, CheckCircle2, Calendar, Filter, Search, ChevronRight, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import HabitStreaks from './HabitStreaks';
import { useAuth } from '@/context/AuthContext';
import { supabase, Habit, HabitCompletion } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HabitFormModal from './HabitFormModal';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface HabitTrackerProps {
  limit?: number;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ limit }) => {
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<(Habit & { streak: number, completedToday: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get all habits
      let query = supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data: habitsData, error: habitsError } = await query;
      
      if (habitsError) throw habitsError;
      
      // Get today's date in ISO format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      // Enhanced habits with streak and completion info
      const enhancedHabits = await Promise.all(habitsData.map(async (habit) => {
        // Check if completed today
        const { data: completionData, error: completionError } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('habit_id', habit.id)
          .eq('completed_date', todayStr);
          
        if (completionError) {
          console.error('Error checking habit completion:', completionError);
        }
        
        const completedToday = completionData && completionData.length > 0;
        
        // Calculate streak
        const { data: streakData, error: streakError } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('habit_id', habit.id)
          .order('completed_date', { ascending: false });
          
        if (streakError) {
          console.error('Error calculating streak:', streakError);
        }
        
        // Simple streak calculation - consecutive days
        let streak = 0;
        if (streakData && streakData.length > 0) {
          const dates = streakData.map(d => new Date(d.completed_date).toISOString().split('T')[0]);
          
          let currentStreak = 0;
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          
          // Check if today is completed
          if (dates.includes(currentDate.toISOString().split('T')[0])) {
            currentStreak = 1;
            
            // Check previous days
            for (let i = 1; i <= 100; i++) { // Limit to 100 days to avoid infinite loop
              const prevDate = new Date();
              prevDate.setDate(currentDate.getDate() - i);
              prevDate.setHours(0, 0, 0, 0);
              
              const prevDateStr = prevDate.toISOString().split('T')[0];
              
              if (dates.includes(prevDateStr)) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
          
          streak = currentStreak;
        }
        
        return {
          ...habit,
          streak,
          completedToday
        };
      }));
      
      setHabits(enhancedHabits);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, isCompleted: boolean) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      if (isCompleted) {
        // Delete the completion record
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_date', todayStr);
          
        if (error) throw error;
      } else {
        // Add a completion record
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            completed_date: todayStr
          });
          
        if (error) throw error;
      }
      
      // Update local state
      setHabits(
        habits.map(habit => 
          habit.id === habitId 
            ? { ...habit, completedToday: !isCompleted } 
            : habit
        )
      );
      
      toast({
        description: isCompleted 
          ? "Habit marked as incomplete for today" 
          : "Habit marked as complete for today!",
      });
      
      // Recalculate streaks by refetching habits
      fetchHabits();
    } catch (error: any) {
      console.error('Error toggling habit completion:', error);
      toast({
        title: "Error",
        description: "Failed to update habit completion",
        variant: "destructive"
      });
    }
  };

  const editHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsAddHabitModalOpen(true);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Habit Tracker</h2>
          <div className="flex items-center gap-2">
            <Link to="/habits">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                setSelectedHabit(undefined);
                setIsAddHabitModalOpen(true);
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Habit
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : habits.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {habits.map(habit => (
              <div 
                key={habit.id} 
                className={cn(
                  "group p-3 rounded-lg border border-border hover:border-primary/50 transition-all",
                  habit.completedToday && "bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "h-8 w-8 rounded-full",
                        habit.completedToday ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                      )}
                      onClick={() => handleToggleHabit(habit.id, habit.completedToday)}
                    >
                      <CheckCircle2 size={18} className={habit.completedToday ? "fill-primary/20" : ""} />
                    </Button>
                    <div>
                      <h3 className="font-medium">{habit.name}</h3>
                      <p className="text-xs text-muted-foreground">{habit.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => editHabit(habit)}
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                </div>
                
                <div className="pl-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${habit.color}20`,
                        color: habit.color,
                        borderColor: habit.color
                      }}
                    >
                      {habit.category}
                    </Badge>
                    
                    {habit.reminder_time && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock size={12} className="mr-1" />
                        {habit.reminder_time}
                      </div>
                    )}
                  </div>
                  
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
              onClick={() => {
                setSelectedHabit(undefined);
                setIsAddHabitModalOpen(true);
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Your First Habit
            </Button>
          </div>
        )}
      </div>
      
      <HabitFormModal 
        isOpen={isAddHabitModalOpen} 
        onClose={() => {
          setIsAddHabitModalOpen(false);
          setSelectedHabit(undefined);
          fetchHabits();
        }} 
        habitToEdit={selectedHabit}
      />
    </div>
  );
};

export default HabitTracker;
