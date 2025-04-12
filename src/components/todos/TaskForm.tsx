
import React, { useState, useEffect } from 'react';
import { Calendar, X, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, Task } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [task, setTask] = useState<{
    title: string;
    description: string;
    due_date?: Date;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }>({
    title: '',
    description: '',
    due_date: undefined,
    priority: 'medium',
    completed: false,
  });

  // If editing, load task data
  useEffect(() => {
    if (taskToEdit) {
      setTask({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        due_date: taskToEdit.due_date ? new Date(taskToEdit.due_date) : undefined,
        priority: taskToEdit.priority,
        completed: taskToEdit.completed,
      });
    } else {
      // Reset form for new task
      setTask({
        title: '',
        description: '',
        due_date: undefined,
        priority: 'medium',
        completed: false,
      });
    }
  }, [taskToEdit]);

  const deleteTask = async () => {
    if (!user || !taskToEdit) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToEdit.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!task.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a task title',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (taskToEdit) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: task.title,
            description: task.description,
            due_date: task.due_date?.toISOString(),
            priority: task.priority,
            completed: task.completed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskToEdit.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Create new task
        const { error } = await supabase
          .from('tasks')
          .insert({
            title: task.title,
            description: task.description,
            due_date: task.due_date?.toISOString(),
            priority: task.priority,
            completed: task.completed,
            user_id: user.id,
          });
          
        if (error) throw error;
      }
      
      toast({
        title: 'Success',
        description: taskToEdit ? 'Task updated successfully' : 'Task created successfully',
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error saving task',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {taskToEdit ? 'Edit Task' : 'New Task'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description"
                className="min-h-[100px]"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {task.due_date ? format(task.due_date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarUI
                    mode="single"
                    selected={task.due_date}
                    onSelect={(date) => setTask({ ...task, due_date: date || undefined })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={task.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => setTask({ ...task, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="completed"
                checked={task.completed}
                onCheckedChange={(checked) => setTask({ ...task, completed: checked })}
              />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div>
              {taskToEdit && (
                <Button
                  variant="destructive"
                  onClick={deleteTask}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Save size={16} className="mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Task'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
