
import React, { useState, useEffect } from 'react';
import { Check, X, Clock, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, Habit } from '@/lib/supabase';

const DEFAULT_COLORS = [
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#6366F1", // Indigo
];

const CATEGORIES = [
  "Health & Fitness",
  "Mindfulness",
  "Productivity",
  "Learning",
  "Finance",
  "Social",
  "Other"
];

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit;
}

const HabitFormModal: React.FC<HabitFormModalProps> = ({
  isOpen,
  onClose,
  habitToEdit
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [habit, setHabit] = useState({
    name: '',
    description: '',
    category: 'Health & Fitness',
    color: DEFAULT_COLORS[0],
    reminder_time: ''
  });

  useEffect(() => {
    if (habitToEdit) {
      setHabit({
        name: habitToEdit.name || '',
        description: habitToEdit.description || '',
        category: habitToEdit.category || 'Health & Fitness',
        color: habitToEdit.color || DEFAULT_COLORS[0],
        reminder_time: habitToEdit.reminder_time || ''
      });
    } else {
      setHabit({
        name: '',
        description: '',
        category: 'Health & Fitness',
        color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
        reminder_time: ''
      });
    }
  }, [habitToEdit, isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!habit.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (habitToEdit) {
        // Update existing habit
        const { error } = await supabase
          .from('habits')
          .update({
            name: habit.name,
            description: habit.description,
            category: habit.category,
            color: habit.color,
            reminder_time: habit.reminder_time || null
          })
          .eq('id', habitToEdit.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Habit updated successfully",
        });
      } else {
        // Create new habit
        const { error } = await supabase
          .from('habits')
          .insert({
            name: habit.name,
            description: habit.description,
            category: habit.category,
            color: habit.color,
            reminder_time: habit.reminder_time || null,
            user_id: user.id
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Habit created successfully",
        });
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save habit",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!habitToEdit || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitToEdit.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete habit",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{habitToEdit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          <DialogDescription>
            {habitToEdit 
              ? 'Update your habit details' 
              : 'Define a new habit you want to build'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input 
              id="name" 
              placeholder="What habit do you want to track?" 
              value={habit.name} 
              onChange={(e) => setHabit({ ...habit, name: e.target.value })} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Add details about this habit" 
              value={habit.description} 
              onChange={(e) => setHabit({ ...habit, description: e.target.value })} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={habit.category} 
              onValueChange={(value) => setHabit({ ...habit, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_COLORS.map((color) => (
                <div 
                  key={color}
                  className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 transition-all"
                  style={{ 
                    backgroundColor: color,
                    borderColor: habit.color === color ? 'white' : color 
                  }}
                  onClick={() => setHabit({ ...habit, color })}
                >
                  {habit.color === color && <Check className="text-white" size={16} />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reminder">Set Reminder (Optional)</Label>
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-muted-foreground" />
              <Input 
                id="reminder" 
                type="time"
                value={habit.reminder_time} 
                onChange={(e) => setHabit({ ...habit, reminder_time: e.target.value })} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          {habitToEdit && (
            <Button variant="destructive" type="button" onClick={handleDelete} disabled={isSubmitting}>
              Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (habitToEdit ? 'Update' : 'Create')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HabitFormModal;
