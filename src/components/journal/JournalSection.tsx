
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, ChevronRight, Download, Search, Tag, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import MoodSelector from './MoodSelector';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase, JournalEntry } from '@/lib/supabase';
import JournalEntryForm from './JournalEntryForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface JournalSectionProps {
  limit?: number;
}

const JournalSection: React.FC<JournalSectionProps> = ({ limit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Load entries
  useEffect(() => {
    fetchEntries();
  }, [user, limit]);

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // For each entry, fetch its tags
      const entriesWithTags = await Promise.all(
        data.map(async (entry) => {
          const { data: tagData, error: tagError } = await supabase
            .from('journal_entries_tags')
            .select('tag_id')
            .eq('entry_id', entry.id);
            
          if (tagError || !tagData) {
            console.error('Error fetching tags for entry:', tagError);
            return { ...entry, tags: [] };
          }
          
          const tagIds = tagData.map(item => item.tag_id);
          
          if (tagIds.length === 0) {
            return { ...entry, tags: [] };
          }
          
          const { data: tags, error: tagsError } = await supabase
            .from('journal_tags')
            .select('name')
            .in('id', tagIds);
            
          if (tagsError || !tags) {
            console.error('Error fetching tag names:', tagsError);
            return { ...entry, tags: [] };
          }
          
          return { ...entry, tags: tags.map(tag => tag.name) };
        })
      );
      
      setEntries(entriesWithTags);
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load journal entries',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!user) return;
    
    try {
      // Create a simple text-based export for now
      let exportText = "JOURNAL ENTRIES\n\n";
      
      entries.forEach(entry => {
        exportText += `Date: ${new Date(entry.created_at).toLocaleDateString()}\n`;
        exportText += `Title: ${entry.title}\n`;
        if (entry.mood) exportText += `Mood: ${entry.mood}\n`;
        if (entry.tags && entry.tags.length > 0) exportText += `Tags: ${entry.tags.join(', ')}\n`;
        exportText += `Content: ${entry.content}\n\n`;
        exportText += "----------------------------\n\n";
      });
      
      // Create a download link for the text file
      const blob = new Blob([exportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal_export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Journal entries exported successfully',
      });
    } catch (error: any) {
      console.error('Error exporting journal entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to export journal entries',
        variant: 'destructive',
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'excited': return '😃';
      case 'tired': return '😴';
      case 'neutral': return '😐';
      default: return '';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-4 border-b border-border bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Journal</h2>
          <div className="flex items-center gap-2">
            <Link to="/journal">
              <Button variant="outline" size="sm" className="gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                View All
                <ChevronRight size={16} />
              </Button>
            </Link>
            <Button 
              size="sm" 
              onClick={handleExportPDF}
              className="gap-1 bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} />
              Export
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                setSelectedEntry(null);
                setIsEntryFormOpen(true);
              }}
              className="gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <PenLine size={16} />
              New Entry
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <div 
                key={entry.id} 
                className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md bg-white/80 dark:bg-black/20 backdrop-blur-sm cursor-pointer"
                onClick={() => {
                  setSelectedEntry(entry);
                  setIsEntryFormOpen(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{getMoodEmoji(entry.mood)}</div>
                    <span className="font-medium text-purple-800 dark:text-purple-300">{formatDate(entry.created_at)}</span>
                  </div>
                  <h3 className="font-semibold">{entry.title}</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  {truncateContent(entry.content)}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No journal entries yet.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-purple-200 dark:border-purple-800"
              onClick={() => {
                setSelectedEntry(null);
                setIsEntryFormOpen(true);
              }}
            >
              <PenLine size={16} className="mr-1" />
              Create your first entry
            </Button>
          </div>
        )}
      </div>

      <JournalEntryForm 
        isOpen={isEntryFormOpen}
        onClose={() => {
          setIsEntryFormOpen(false);
          setSelectedEntry(null);
        }}
        entryToEdit={selectedEntry}
        onSuccess={fetchEntries}
      />
    </div>
  );
};

export default JournalSection;
