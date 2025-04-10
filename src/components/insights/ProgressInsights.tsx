
import React from 'react';
import { habits, journalEntries, todos } from '@/lib/mockData';
import Navbar from '../layout/Navbar';
import AchievementBadges from '../achievements/AchievementBadges';
import { achievements } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProgressInsights: React.FC = () => {
  // Generate data for the streak chart
  const generateStreakData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      
      // Count habits completed on this day
      const completedHabits = habits.filter(habit =>
        habit.completedDates.some(completedDate =>
          completedDate.getDate() === date.getDate() &&
          completedDate.getMonth() === date.getMonth() &&
          completedDate.getFullYear() === date.getFullYear()
        )
      ).length;
      
      data.push({
        date: formattedDate,
        completed: completedHabits,
      });
    }
    
    return data;
  };
  
  // Calculate habit completion rate
  const calculateCompletionRate = () => {
    const totalHabits = habits.length * 7; // 7 days
    let completedHabits = 0;
    
    const today = new Date();
    
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        const daysDifference = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDifference < 7) {
          completedHabits++;
        }
      });
    });
    
    return Math.round((completedHabits / totalHabits) * 100);
  };
  
  // Generate data for the category distribution
  const generateCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    
    habits.forEach(habit => {
      if (categoryCounts[habit.category]) {
        categoryCounts[habit.category]++;
      } else {
        categoryCounts[habit.category] = 1;
      }
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  };
  
  const streakData = generateStreakData();
  const completionRate = calculateCompletionRate();
  const categoryData = generateCategoryData();
  
  const categoryColors = ['#8B5CF6', '#3B82F6', '#14B8A6', '#F97316', '#EF4444'];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Navbar activePage="insights" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Progress Insights</h1>
            <p className="text-muted-foreground">Track your habits, journal entries, and achievements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-1">Completion Rate</h3>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">{completionRate}%</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                  <p className="text-sm font-medium">
                    {completionRate >= 80 ? 'Excellent!' : completionRate >= 60 ? 'Good progress!' : 'Keep going!'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-1">Journal Entries</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-500 mr-4">{journalEntries.length}</span>
                <div>
                  <p className="text-sm text-muted-foreground">Total entries</p>
                  <p className="text-sm font-medium">
                    {journalEntries.length > 10 ? 'Consistent journaling!' : 'Building the habit!'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-1">Completed Tasks</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-teal-500 mr-4">
                  {todos.filter(todo => todo.completed).length}/{todos.length}
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Task completion</p>
                  <p className="text-sm font-medium">
                    {todos.filter(todo => todo.completed).length > todos.length / 2 ? 'Productive!' : 'Keep focusing!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Habit Completion Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={streakData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#8B5CF6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Habit Categories</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      label={({ category }) => `${category}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Achievements</h3>
            <AchievementBadges achievements={achievements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressInsights;
