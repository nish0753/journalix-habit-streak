
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Calendar, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, Task } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import TaskForm from './TaskForm';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isToday } from 'date-fns';

interface TodoListProps {
  limit?: number;
}

const TodoList: React.FC<TodoListProps> = ({ limit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [user, limit]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
        
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTasks(data);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Update local state
      setTasks(
        tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: !completed } 
            : task
        )
      );
      
      toast({
        description: completed 
          ? "Task marked as incomplete" 
          : "Task completed!",
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };
  
  const getDueDateStatus = (dateString?: string) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    
    if (isToday(dueDate)) {
      return <Badge className="bg-amber-500">Today</Badge>;
    } else if (isPast(dueDate)) {
      return <Badge className="bg-red-500">Overdue</Badge>;
    }
    
    return <Badge className="bg-green-500">{format(dueDate, 'MMM d')}</Badge>;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="flex items-center gap-2">
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                setSelectedTask(null);
                setIsTaskFormOpen(true);
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Task
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={cn(
                  "group p-3 rounded-lg border border-border hover:border-primary/50 transition-all",
                  task.completed && "bg-muted/50 opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-6 w-6 rounded-full mt-0.5",
                      task.completed ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskCompletion(task.id, task.completed);
                    }}
                  >
                    {task.completed ? <CheckCircle2 size={18} className="fill-primary/20" /> : <Circle size={18} />}
                  </Button>
                  
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsTaskFormOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-medium",
                        task.completed && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </Badge>
                        {task.due_date && getDueDateStatus(task.due_date)}
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description
                        }
                      </p>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Calendar size={12} className="mr-1" />
                        {format(new Date(task.due_date), 'MMMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any tasks yet.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedTask(null);
                setIsTaskFormOpen(true);
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Your First Task
            </Button>
          </div>
        )}
      </div>
      
      <TaskForm 
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default TodoList;
