import React, { useState } from 'react';
import { journalEntries } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { PenLine, ChevronRight, X, Download, BookText, Tag, Calendar } from 'lucide-react';
import { JournalEntry } from '@/types';
import { Link } from 'react-router-dom';
import MoodSelector from './MoodSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

interface JournalSectionProps {
  limit?: number;
}

type JournalTemplate = 'freeform' | 'gratitude' | 'reflection' | 'goals' | 'daily';

interface TemplateOption {
  value: JournalTemplate;
  label: string;
  description: string;
  placeholderText: string;
}

const JournalSection: React.FC<JournalSectionProps> = ({ limit }) => {
  const [entries] = useState<JournalEntry[]>(limit ? journalEntries.slice(0, limit) : journalEntries);
  const [newEntry, setNewEntry] = useState<{
    content: string;
    mood?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'peaceful' | 'tired' | 'anxious' | 'grateful' | 'motivated';
    tags: string;
    template: JournalTemplate;
  }>({
    content: '',
    mood: undefined,
    tags: '',
    template: 'freeform',
  });
  const [isOpen, setIsOpen] = useState(false);

  const templates: TemplateOption[] = [
    {
      value: 'freeform',
      label: 'Free Writing',
      description: 'Write freely about anything on your mind.',
      placeholderText: 'What\'s on your mind today?',
    },
    {
      value: 'gratitude',
      label: 'Gratitude Journal',
      description: 'Focus on things you\'re grateful for today.',
      placeholderText: 'Today, I am grateful for...',
    },
    {
      value: 'reflection',
      label: 'Daily Reflection',
      description: 'Reflect on your experiences, challenges, and wins.',
      placeholderText: 'Today was... One thing I learned was... A challenge I faced was... One win I had was...',
    },
    {
      value: 'goals',
      label: 'Goals & Intentions',
      description: 'Set intentions and goals for the day or week.',
      placeholderText: 'My goals for today/this week are... My intention is to...',
    },
    {
      value: 'daily',
      label: 'Morning Pages',
      description: 'Stream of consciousness writing to clear your mind.',
      placeholderText: 'Start writing without filtering your thoughts...',
    },
  ];

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
      case 'peaceful':
        return '😌';
      case 'anxious':
        return '😰';
      case 'grateful':
        return '🙏';
      case 'motivated':
        return '💪';
      default:
        return '';
    }
  };

  const handleNewEntry = () => {
    // This would normally save to a database
    console.log('New journal entry:', newEntry);
    setNewEntry({ content: '', mood: undefined, tags: '', template: 'freeform' });
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    // Mock export functionality - would normally generate a PDF
    console.log('Exporting journal as PDF');
    alert('Your journal is being exported as PDF. This feature will be fully functional once connected to Supabase.');
  };

  const handleTemplateChange = (template: JournalTemplate) => {
    const selectedTemplate = templates.find(t => t.value === template);
    setNewEntry({
      ...newEntry,
      template,
      content: newEntry.content || (selectedTemplate ? '' : '')
    });
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
              onClick={() => handleExportPDF()}
              className="gap-1 bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} />
              Export
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                  <PenLine size={16} />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Create Journal Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="template">Template</TabsTrigger>
                      <TabsTrigger value="mood">Mood & Tags</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-medium">Journal Entry</Label>
                          <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
                        </div>
                        <Textarea 
                          placeholder={templates.find(t => t.value === newEntry.template)?.placeholderText || "What's on your mind today?"}
                          className="min-h-[250px] bg-white/80 dark:bg-black/20 border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500" 
                          value={newEntry.content}
                          onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="template" className="space-y-4">
                      <Label className="text-lg font-medium">Choose a Template</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <div 
                            key={template.value}
                            onClick={() => handleTemplateChange(template.value)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-md ${newEntry.template === template.value 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm' 
                              : 'border-border bg-white/80 dark:bg-black/20'}`}
                          >
                            <div className="font-medium mb-1">{template.label}</div>
                            <div className="text-sm text-muted-foreground">{template.description}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="mood" className="space-y-4">
                      <MoodSelector 
                        selectedMood={newEntry.mood} 
                        onChange={(mood) => setNewEntry({...newEntry, mood})}
                      />
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2">
                          <Tag size={16} />
                          <Label>Tags</Label>
                        </div>
                        <Input 
                          placeholder="self-care, work, family, health (comma separated)" 
                          value={newEntry.tags}
                          onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                          className="bg-white/80 dark:bg-black/20 border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleNewEntry}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                  >
                    Save Entry
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30 min-h-[200px]">
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <div 
                key={entry.id} 
                className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md bg-white/80 dark:bg-black/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{getMoodEmoji(entry.mood)}</div>
                    <span className="font-medium text-purple-800 dark:text-purple-300">{formatDate(entry.date)}</span>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="badge bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 px-2 py-1 rounded-full text-xs transition-all hover:bg-purple-200 dark:hover:bg-purple-800/70"
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
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                    Read more
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No journal entries yet.</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-purple-200 dark:border-purple-800">
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
