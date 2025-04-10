
import React from 'react';
import Navbar from '../layout/Navbar';
import HabitTracker from '../habits/HabitTracker';
import JournalSection from '../journal/JournalSection';
import TodoList from '../todos/TodoList';
import { CalendarClock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { habitCategories, achievements } from '@/lib/mockData';
import AchievementBadges from '../achievements/AchievementBadges';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Navbar activePage="dashboard" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Good morning!</h1>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
              <Link to="/calendar">
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarClock size={18} />
                  <span>Calendar</span>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
                <h3 className="font-semibold text-lg mb-1">Current Streak</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-purple-500">7</span>
                  <span className="text-muted-foreground text-sm mb-1">days</span>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
                <h3 className="font-semibold text-lg mb-1">Completed Today</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-indigo-500">3/5</span>
                  <span className="text-muted-foreground text-sm mb-1">habits</span>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
                <h3 className="font-semibold text-lg mb-1">Journal Entries</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-teal-500">12</span>
                  <span className="text-muted-foreground text-sm mb-1">this month</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <HabitTracker />
              <JournalSection limit={1} />
            </div>
            
            <div className="space-y-8">
              <TodoList limit={5} />
              
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Award size={18} />
                    Recent Achievements
                  </h3>
                  <Link to="/insights">
                    <Button variant="ghost" size="sm">
                      View all
                    </Button>
                  </Link>
                </div>
                <AchievementBadges achievements={achievements.slice(0, 3)} />
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Habit Categories</h3>
                <div className="space-y-3">
                  {habitCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">5 habits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
