
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Habit related types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  streak: number;
  color?: string;
  createdAt: Date;
  completedDates: Date[];
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Journal related types
export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood?: 'happy' | 'neutral' | 'sad' | 'excited' | 'tired';
  tags: string[];
}

// Todo related types
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  createdAt: Date;
}

// Achievement related types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'habit' | 'journal' | 'todo' | 'general';
}

// Calendar related types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  category?: string;
  color?: string;
}
