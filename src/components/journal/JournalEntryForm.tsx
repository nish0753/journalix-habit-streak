import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Save, X, Trash } from 'lucide-react';
import MoodSelector from './MoodSelector';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry, supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Define the allowed mood types to match the expected type
type Mood = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'anxious' | 'peaceful';

interface JournalEntryFormProps {
  entry?: JournalEntry;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  onDelete?: (id: string) => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, onClose, onSave, onDelete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(entry?.mood as Mood || null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JournalEntry>({
    defaultValues: {
      id: entry?.id || '',
      user_id: user?.id || '',
      title: entry?.title || '',
      content: entry?.content || '',
      mood: entry?.mood || '',
    },
  });

  useEffect(() => {
    if (entry) {
      setValue('title', entry.title || '');
      setValue('content', entry.content || '');
    }
  }, [entry, setValue]);

  // Fix the mood type issue by ensuring it's properly typed
  const handleMoodChange = (selectedMood: Mood) => {
    setSelectedMood(selectedMood);
  };

  const onSubmit = async (data: JournalEntry) => {
    try {
      const entryData = {
        ...data,
        user_id: user?.id,
        mood: selectedMood,
      };

      if (entry?.id) {
        // Update existing entry
        const { data: updatedEntry, error } = await supabase
          .from('journal_entries')
          .update(entryData)
          .eq('id', entry.id)
          .select()
          .single();

        if (error) {
          toast({
            title: "Error updating journal entry",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Journal entry updated",
          description: "Your journal entry has been successfully updated.",
        });
        onSave(updatedEntry as JournalEntry);
      } else {
        // Create new entry
        const { data: newEntry, error } = await supabase
          .from('journal_entries')
          .insert([entryData])
          .select()
          .single();

        if (error) {
          toast({
            title: "Error creating journal entry",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Journal entry created",
          description: "Your new journal entry has been successfully saved.",
        });
        onSave(newEntry as JournalEntry);
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!entry?.id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entry.id);

      if (error) {
        toast({
          title: "Error deleting journal entry",
          description: error.message,
          variant: "destructive",
        });
        setIsDeleting(false);
        return;
      }

      toast({
        title: "Journal entry deleted",
        description: "The journal entry has been successfully deleted.",
      });
      onDelete?.(entry.id); // Call the onDelete prop if it exists
      onClose();
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry?.id ? 'Edit Entry' : 'New Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Entry Title"
              {...register('title', { required: 'Title is required' })}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts here..."
              {...register('content', { required: 'Content is required' })}
              className={errors.content ? 'border-destructive' : ''}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>

          <div>
            <Label>Mood</Label>
            <MoodSelector selectedMood={selectedMood} onMoodChange={handleMoodChange} />
          </div>

          <CardFooter className="justify-between">
            <div className="flex space-x-2">
              {entry?.id && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Trash className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              )}
              <Button variant="secondary" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default JournalEntryForm;
