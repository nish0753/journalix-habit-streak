
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HabitTracker from '@/components/habits/HabitTracker';
import { PlusCircle, Clock, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HabitTracking: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <Navbar activePage="habits" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Habit Tracking</h1>
            <p className="text-muted-foreground">Track your daily habits and build consistent streaks</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="font-semibold text-lg mb-1">Current Streak</h3>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-purple-500">7</span>
                <span className="text-muted-foreground text-sm mb-1">days</span>
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="font-semibold text-lg mb-1">Habits Today</h3>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-indigo-500">3/5</span>
                <span className="text-muted-foreground text-sm mb-1">completed</span>
              </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="font-semibold text-lg mb-1">Total Habits</h3>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-teal-500">8</span>
                <span className="text-muted-foreground text-sm mb-1">active</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>New Habit</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock size={18} />
              <span>Set Reminder</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ListChecks size={18} />
              <span>View Categories</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <HabitTracker />
            
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-semibold mb-4">Consistency is Key</h3>
                  <p className="text-muted-foreground mb-4">
                    Building habits takes time. Research shows it takes about 66 days to form a new habit.
                    Keep showing up daily and your streaks will grow.
                  </p>
                  <Button>Learn More About Habits</Button>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src="/placeholder.svg" 
                    alt="Habit Formation" 
                    className="rounded-lg border border-border shadow-sm w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracking;
