
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { calendarEvents } from '@/lib/mockData';
import Navbar from '../layout/Navbar';
import { cn } from '@/lib/utils';

const MonthlyView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Get events for the current month
  const eventsThisMonth = calendarEvents.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });
  
  // Group events by date
  const eventsByDate = eventsThisMonth.reduce((acc, event) => {
    const day = new Date(event.start).getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(event);
    return acc;
  }, {} as Record<number, typeof calendarEvents>);
  
  const today = new Date();
  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };
  
  // Create calendar grid
  const createCalendarGrid = () => {
    const totalDays = daysInMonth;
    const totalCells = Math.ceil((totalDays + firstDayOfMonth) / 7) * 7;
    const grid = [];
    
    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      
      if (day > 0 && day <= totalDays) {
        grid.push({
          day,
          events: eventsByDate[day] || [],
          currentMonth: true,
        });
      } else {
        // Empty cell
        grid.push({
          day: 0,
          events: [],
          currentMonth: false,
        });
      }
    }
    
    return grid;
  };
  
  const calendarGrid = createCalendarGrid();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Navbar activePage="calendar" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-muted-foreground">Plan your month and stay organized</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight size={18} />
              </Button>
              <Button>
                <Plus size={16} className="mr-1" />
                Add Event
              </Button>
            </div>
          </div>
          
          <div className="text-2xl font-semibold mb-6">
            {monthNames[currentMonth]} {currentYear}
          </div>
          
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {dayNames.map((day, index) => (
                <div 
                  key={index} 
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {calendarGrid.map((cell, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "min-h-24 p-2 border-r border-b border-border last:border-r-0 relative",
                    !cell.currentMonth && "bg-muted/20",
                    isToday(cell.day) && "bg-primary/5"
                  )}
                >
                  {cell.day > 0 && (
                    <>
                      <div className={cn(
                        "text-sm mb-1 font-medium",
                        isToday(cell.day) && "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mx-auto"
                      )}>
                        {cell.day}
                      </div>
                      
                      <div className="space-y-1">
                        {cell.events.slice(0, 3).map((event, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: event.color }}
                          >
                            <span className="text-white">{event.title}</span>
                          </div>
                        ))}
                        
                        {cell.events.length > 3 && (
                          <div className="text-xs text-muted-foreground p-1">
                            +{cell.events.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
