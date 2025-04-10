
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import TodoList from '@/components/todos/TodoList';
import { Plus, Calendar, Filter, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Tasks: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <Navbar activePage="tasks" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">Organize your to-dos and stay productive</p>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              <span>Add Task</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar size={18} />
              <span>By Due Date</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              <span>Filter</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowDownUp size={18} />
              <span>Sort</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <TodoList />
            
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-semibold mb-4">Get Things Done</h3>
                  <p className="text-muted-foreground mb-4">
                    Breaking down large tasks into smaller, manageable steps makes progress easier.
                    Focus on completing one task at a time to boost productivity.
                  </p>
                  <Button>Productivity Tips</Button>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80" 
                    alt="Task Management" 
                    className="rounded-lg border border-border shadow-sm w-full h-auto object-cover aspect-video"
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

export default Tasks;
