
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createHabit } from '@/services/habitService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { habitCategories } from '@/lib/mockData';
import { CirclePicker } from 'react-color';

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editHabit?: any; // Add type for editing existing habits later
}

const HabitFormModal: React.FC<HabitFormModalProps> = ({ isOpen, onClose, editHabit }) => {
  const [name, setName] = useState(editHabit?.name || '');
  const [description, setDescription] = useState(editHabit?.description || '');
  const [category, setCategory] = useState(editHabit?.category || habitCategories[0]?.id || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(editHabit?.frequency || 'daily');
  const [color, setColor] = useState(editHabit?.color || '#8B5CF6');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create habit",
        variant: "destructive"
      });
    }
  });
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory(habitCategories[0]?.id || '');
    setFrequency('daily');
    setColor('#8B5CF6');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive"
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create habits",
        variant: "destructive"
      });
      return;
    }
    
    createHabitMutation.mutate({
      name,
      description,
      category,
      frequency,
      color,
      userId: user.id,
      streak: 0,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Morning Meditation"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="e.g., 10 minutes of mindfulness meditation"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {habitCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'custom') => setFrequency(value)}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="mt-2">
                <CirclePicker 
                  color={color}
                  onChange={(color) => setColor(color.hex)}
                  colors={['#8B5CF6', '#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#6366F1', '#EC4899', '#10B981']}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createHabitMutation.isPending}
            >
              {createHabitMutation.isPending ? 'Saving...' : editHabit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitFormModal;
