
import React, { useState } from 'react';
import { journalEntries } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { PenLine, ChevronRight, X } from 'lucide-react';
import { JournalEntry } from '@/types';
import { Link } from 'react-router-dom';
import MoodSelector from './MoodSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface JournalSectionProps {
  limit?: number;
}

const JournalSection: React.FC<JournalSectionProps> = ({ limit }) => {
  const [entries] = useState<JournalEntry[]>(limit ? journalEntries.slice(0, limit) : journalEntries);
  const [newEntry, setNewEntry] = useState<{content: string; mood?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited'; tags: string}>({
    content: '',
    mood: undefined,
    tags: ''
  });
  const [isOpen, setIsOpen] = useState(false);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😔';
      case 'excited':
        return '😃';
      case 'tired':
        return '😴';
      case 'neutral':
        return '😐';
      case 'angry':
        return '😠';
      default:
        return '';
    }
  };

  const handleNewEntry = () => {
    // This would normally save to a database
    console.log('New journal entry:', newEntry);
    setNewEntry({content: '', mood: undefined, tags: ''});
    setIsOpen(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Journal</h2>
          <div className="flex items-center gap-2">
            <Link to="/journal">
              <Button variant="outline" size="sm" className="gap-1">
                View All
                <ChevronRight size={16} />
              </Button>
            </Link>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PenLine size={16} />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create Journal Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <MoodSelector 
                    selectedMood={newEntry.mood} 
                    onChange={(mood) => setNewEntry({...newEntry, mood})}
                  />
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="What's on your mind today?" 
                      className="min-h-[150px]" 
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Tags (comma separated)" 
                      value={newEntry.tags}
                      onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleNewEntry}>Save Entry</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{getMoodEmoji(entry.mood)}</div>
                    <span className="font-medium">{formatDate(entry.date)}</span>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="badge bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {truncateContent(entry.content)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No journal entries yet.</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  <PenLine size={16} className="mr-1" />
                  Create your first entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                {/* Dialog content same as above */}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalSection;
