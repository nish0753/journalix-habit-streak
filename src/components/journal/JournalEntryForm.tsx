
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, JournalEntry, JournalTag } from '@/lib/supabase';
import MoodSelector from './MoodSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface JournalEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: JournalEntry | null;
  onSuccess?: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  isOpen,
  onClose,
  entryToEdit,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366F1');
  const [availableTags, setAvailableTags] = useState<JournalTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<JournalTag[]>([]);

  const [entry, setEntry] = useState<{
    title: string;
    content: string;
    mood?: string;
  }>({
    title: '',
    content: '',
    mood: undefined,
  });

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('journal_tags')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }
      
      setAvailableTags(data);
    };
    
    fetchTags();
  }, [user, isTagDialogOpen]);

  // If editing, load entry data
  useEffect(() => {
    if (entryToEdit) {
      setEntry({
        title: entryToEdit.title,
        content: entryToEdit.content,
        mood: entryToEdit.mood,
      });
      
      // Fetch tags for this entry
      const fetchEntryTags = async () => {
        const { data, error } = await supabase
          .from('journal_entries_tags')
          .select('tag_id')
          .eq('entry_id', entryToEdit.id);
          
        if (error || !data) {
          console.error('Error fetching entry tags:', error);
          return;
        }
        
        const tagIds = data.map(item => item.tag_id);
        
        if (tagIds.length > 0) {
          const { data: tags, error: tagsError } = await supabase
            .from('journal_tags')
            .select('*')
            .in('id', tagIds);
            
          if (tagsError || !tags) {
            console.error('Error fetching tags by IDs:', tagsError);
            return;
          }
          
          setSelectedTags(tags);
        }
      };
      
      fetchEntryTags();
    } else {
      // Reset form for new entry
      setEntry({
        title: '',
        content: '',
        mood: undefined,
      });
      setSelectedTags([]);
    }
  }, [entryToEdit]);

  const createTag = async () => {
    if (!user || !newTagName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('journal_tags')
        .insert({
          name: newTagName.trim(),
          color: newTagColor,
          user_id: user.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Tag created successfully!',
      });
      
      setNewTagName('');
      setIsTagDialogOpen(false);
      
      // Add the new tag to selected tags
      if (data) {
        setSelectedTags(prev => [...prev, data]);
      }
    } catch (error: any) {
      toast({
        title: 'Error creating tag',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleTag = (tag: JournalTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const deleteEntry = async () => {
    if (!user || !entryToEdit) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryToEdit.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Journal entry deleted successfully',
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error deleting entry',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!entry.title.trim() || !entry.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter both title and content',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let entryId = entryToEdit?.id;
      
      if (entryToEdit) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            updated_at: new Date().toISOString(),
          })
          .eq('id', entryToEdit.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            user_id: user.id,
          })
          .select()
          .single();
          
        if (error) throw error;
        entryId = data.id;
      }
      
      // Handle tags if we have an entry ID
      if (entryId) {
        // First delete existing tag associations if editing
        if (entryToEdit) {
          await supabase
            .from('journal_entries_tags')
            .delete()
            .eq('entry_id', entryId);
        }
        
        // Then add the selected tags
        if (selectedTags.length > 0) {
          const tagAssociations = selectedTags.map(tag => ({
            entry_id: entryId,
            tag_id: tag.id,
          }));
          
          const { error: tagError } = await supabase
            .from('journal_entries_tags')
            .insert(tagAssociations);
            
          if (tagError) {
            console.error('Error adding tags to entry:', tagError);
          }
        }
      }
      
      toast({
        title: 'Success',
        description: entryToEdit ? 'Journal entry updated successfully' : 'Journal entry created successfully',
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error saving entry',
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
      <div className="bg-card rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {entryToEdit ? 'Edit Journal Entry' : 'New Journal Entry'}
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
                placeholder="Entry title"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts..."
                className="min-h-[200px]"
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
              />
            </div>
            
            <div>
              <Label>How are you feeling?</Label>
              <MoodSelector
                selectedMood={entry.mood}
                onChange={(mood) => setEntry({ ...entry, mood })}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Tags</Label>
                <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Tag size={16} className="mr-2" />
                      Create Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Tag</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tagName">Tag Name</Label>
                        <Input
                          id="tagName"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="Enter tag name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tagColor">Tag Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="tagColor"
                            type="color"
                            className="w-12 h-10 p-1"
                            value={newTagColor}
                            onChange={(e) => setNewTagColor(e.target.value)}
                          />
                          <div 
                            className="w-10 h-10 rounded-full" 
                            style={{ backgroundColor: newTagColor }}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createTag}>
                        Create Tag
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {availableTags.map(tag => (
                  <Badge
                    key={tag.id}
                    style={{ 
                      backgroundColor: selectedTags.some(t => t.id === tag.id) ? tag.color : 'transparent',
                      color: selectedTags.some(t => t.id === tag.id) ? 'white' : 'inherit',
                      borderColor: tag.color
                    }}
                    className="cursor-pointer border"
                    variant={selectedTags.some(t => t.id === tag.id) ? "default" : "outline"}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {availableTags.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tags created yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div>
              {entryToEdit && (
                <Button
                  variant="destructive"
                  onClick={deleteEntry}
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
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryForm;
