
import { Habit, HabitCategory, JournalEntry, Todo, Achievement, CalendarEvent } from '@/types';

// Current date for reference
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Habit Categories
export const habitCategories: HabitCategory[] = [
  { id: '1', name: 'Health', color: '#8B5CF6', icon: 'Heart' },
  { id: '2', name: 'Productivity', color: '#3B82F6', icon: 'Laptop' },
  { id: '3', name: 'Learning', color: '#14B8A6', icon: 'BookOpen' },
  { id: '4', name: 'Mindfulness', color: '#F97316', icon: 'Brain' },
  { id: '5', name: 'Fitness', color: '#EF4444', icon: 'Dumbbell' },
];

// Habits
export const habits: Habit[] = [
  {
    id: '1',
    name: 'Drink water',
    description: 'Drink 8 glasses of water daily',
    category: '1',
    frequency: 'daily',
    streak: 5,
    color: '#8B5CF6',
    createdAt: new Date('2023-01-01'),
    completedDates: [twoDaysAgo, yesterday, today],
  },
  {
    id: '2',
    name: 'Read a book',
    description: 'Read for at least 30 minutes',
    category: '3',
    frequency: 'daily',
    streak: 10,
    color: '#14B8A6',
    createdAt: new Date('2023-01-05'),
    completedDates: [twoDaysAgo, yesterday],
  },
  {
    id: '3',
    name: 'Morning meditation',
    description: '10 minutes of meditation',
    category: '4',
    frequency: 'daily',
    streak: 3,
    color: '#F97316',
    createdAt: new Date('2023-01-10'),
    completedDates: [yesterday, today],
  },
  {
    id: '4',
    name: 'Exercise',
    description: '30 minutes of workout',
    category: '5',
    frequency: 'daily',
    streak: 7,
    color: '#EF4444',
    createdAt: new Date('2023-01-15'),
    completedDates: [twoDaysAgo, today],
  },
  {
    id: '5',
    name: 'Code practice',
    description: 'Practice coding for 1 hour',
    category: '2',
    frequency: 'daily',
    streak: 15,
    color: '#3B82F6',
    createdAt: new Date('2023-01-20'),
    completedDates: [twoDaysAgo, yesterday, today],
  },
];

// Journal Entries
export const journalEntries: JournalEntry[] = [
  {
    id: '1',
    date: today,
    content: "Today was productive. I managed to complete all my tasks and still had time for self-care. I'm feeling optimistic about the progress I'm making.",
    mood: 'happy',
    tags: ['productive', 'self-care'],
  },
  {
    id: '2',
    date: yesterday,
    content: "Feeling a bit overwhelmed with the workload. Need to find better ways to manage my time. Tomorrow I'll try to prioritize better.",
    mood: 'tired',
    tags: ['work', 'stress'],
  },
  {
    id: '3',
    date: twoDaysAgo,
    content: "Had a great workout session today. Physical activity always helps clear my mind. I also finished reading the book I started last week.",
    mood: 'excited',
    tags: ['workout', 'reading'],
  },
];

// Todo Items
export const todos: Todo[] = [
  {
    id: '1',
    title: 'Finish project proposal',
    description: 'Complete the draft and send for review',
    completed: false,
    dueDate: tomorrow,
    priority: 'high',
    category: 'Work',
    createdAt: yesterday,
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Get items for the week',
    completed: true,
    dueDate: today,
    priority: 'medium',
    category: 'Personal',
    createdAt: twoDaysAgo,
  },
  {
    id: '3',
    title: 'Call doctor',
    description: 'Schedule annual checkup',
    completed: false,
    dueDate: tomorrow,
    priority: 'medium',
    category: 'Health',
    createdAt: today,
  },
  {
    id: '4',
    title: 'Pay bills',
    description: 'Electricity and internet',
    completed: false,
    dueDate: tomorrow,
    priority: 'high',
    category: 'Finance',
    createdAt: yesterday,
  },
  {
    id: '5',
    title: 'Prepare presentation',
    description: 'For the team meeting',
    completed: false,
    dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'Work',
    createdAt: today,
  },
];

// Achievements
export const achievements: Achievement[] = [
  {
    id: '1',
    name: '7-Day Streak',
    description: 'Complete a habit for 7 consecutive days',
    icon: 'Award',
    earnedAt: yesterday,
    category: 'habit',
  },
  {
    id: '2',
    name: 'Journal Master',
    description: 'Write in your journal for 10 days',
    icon: 'BookOpen',
    progress: 7,
    maxProgress: 10,
    category: 'journal',
  },
  {
    id: '3',
    name: 'Task Champion',
    description: 'Complete 50 tasks',
    icon: 'CheckCircle',
    progress: 28,
    maxProgress: 50,
    category: 'todo',
  },
  {
    id: '4',
    name: 'Early Bird',
    description: 'Log in before 7 AM for 5 days',
    icon: 'Sunrise',
    progress: 3,
    maxProgress: 5,
    category: 'general',
  },
  {
    id: '5',
    name: '30-Day Milestone',
    description: 'Use the app for 30 consecutive days',
    icon: 'Calendar',
    progress: 22,
    maxProgress: 30,
    category: 'general',
  },
];

// Calendar Events
export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
    description: 'Weekly team sync',
    category: 'Work',
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
    description: 'Annual checkup',
    category: 'Health',
    color: '#8B5CF6',
  },
  {
    id: '3',
    title: 'Gym Session',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 19, 30),
    description: 'Cardio and strength training',
    category: 'Fitness',
    color: '#EF4444',
  },
  {
    id: '4',
    title: 'Birthday Party',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    allDay: true,
    description: 'Sarah\'s birthday celebration',
    category: 'Personal',
    color: '#14B8A6',
  },
  {
    id: '5',
    title: 'Project Deadline',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    allDay: true,
    description: 'Final submission for client project',
    category: 'Work',
    color: '#F97316',
  },
];
