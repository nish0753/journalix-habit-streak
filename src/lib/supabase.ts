
import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase URL and key from the auto-generated client
const supabaseUrl = "https://hynltrocukhcsmvpbmhc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bmx0cm9jdWtoY3NtdnBibWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNTA3ODMsImV4cCI6MjA1OTkyNjc4M30.s68OuA1q0TpAOClz9QH1sx7O5KBcTyRLG30qlRUBETg";

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export types for our tables
export type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
};

export type JournalTag = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
  reminder_time?: string;
  created_at: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completed_date: string;
  created_at: string;
};

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Since we're now using the actual values
};
