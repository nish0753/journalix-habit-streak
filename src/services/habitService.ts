
import { supabase } from '@/lib/supabase';
import { Habit } from '@/types';

export const fetchUserHabits = async (userId: string): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching habits:', error);
    throw new Error('Failed to fetch habits');
  }
  
  // Convert database dates to JavaScript Date objects
  return data.map(habit => ({
    ...habit,
    createdAt: new Date(habit.created_at),
    completedDates: (habit.completed_dates || []).map((date: string) => new Date(date))
  }));
};

export const createHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'> & { userId: string }): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency,
      streak: 0,
      color: habit.color,
      user_id: habit.userId,
      completed_dates: []
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating habit:', error);
    throw new Error('Failed to create habit');
  }
  
  return {
    ...data,
    id: data.id,
    createdAt: new Date(data.created_at),
    completedDates: []
  };
};

export const updateHabit = async (habit: Partial<Habit> & { id: string }): Promise<void> => {
  const updates: any = { ...habit };
  
  // Convert Date objects to ISO strings for the database
  if (updates.completedDates) {
    updates.completed_dates = updates.completedDates.map(date => date.toISOString());
    delete updates.completedDates;
  }
  
  const { error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habit.id);
    
  if (error) {
    console.error('Error updating habit:', error);
    throw new Error('Failed to update habit');
  }
};

export const toggleHabitCompletion = async (habitId: string, completed: boolean): Promise<Habit> => {
  // First, get the current habit data
  const { data: habit, error: fetchError } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching habit:', fetchError);
    throw new Error('Failed to fetch habit for completion toggle');
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  
  let updatedDates = [...(habit.completed_dates || [])];
  let updatedStreak = habit.streak;
  
  if (completed) {
    // Add today's date if not already present
    if (!updatedDates.includes(todayISO)) {
      updatedDates.push(todayISO);
      
      // Check if this completion continues a streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = yesterday.toISOString().split('T')[0];
      
      if (updatedDates.some(date => date.startsWith(yesterdayISO)) || updatedStreak === 0) {
        updatedStreak += 1;
      }
    }
  } else {
    // Remove today's date if present
    updatedDates = updatedDates.filter(date => !date.startsWith(todayISO.split('T')[0]));
    
    // Check if removing today breaks a streak
    if (updatedStreak > 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = yesterday.toISOString().split('T')[0];
      
      const isYesterdayCompleted = updatedDates.some(date => date.startsWith(yesterdayISO));
      const isTomorrowTheNextDay = updatedDates.some(date => {
        const dateObj = new Date(date);
        return dateObj > today;
      });
      
      if (!isYesterdayCompleted && !isTomorrowTheNextDay) {
        updatedStreak = 0;
      }
    }
  }
  
  // Update the habit with new completion data
  const { data: updatedHabit, error: updateError } = await supabase
    .from('habits')
    .update({
      completed_dates: updatedDates,
      streak: updatedStreak
    })
    .eq('id', habitId)
    .select()
    .single();
    
  if (updateError) {
    console.error('Error updating habit completion:', updateError);
    throw new Error('Failed to update habit completion');
  }
  
  return {
    ...updatedHabit,
    createdAt: new Date(updatedHabit.created_at),
    completedDates: updatedDates.map(date => new Date(date))
  };
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId);
    
  if (error) {
    console.error('Error deleting habit:', error);
    throw new Error('Failed to delete habit');
  }
};
