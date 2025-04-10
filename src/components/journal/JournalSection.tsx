
import React, { useState } from 'react';
import { journalEntries } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { PenLine, ChevronRight } from 'lucide-react';
import { JournalEntry } from '@/types';
import { Link } from 'react-router-dom';

interface JournalSectionProps {
  limit?: number;
}

const JournalSection: React.FC<JournalSectionProps> = ({ limit }) => {
  const [entries] = useState<JournalEntry[]>(limit ? journalEntries.slice(0, limit) : journalEntries);

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
      default:
        return '';
    }
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
            <Button size="sm" className="gap-1">
              <PenLine size={16} />
              New Entry
            </Button>
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
                          className="badge bg-secondary text-secondary-foreground"
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
            <Button variant="outline" size="sm" className="mt-2">
              <PenLine size={16} className="mr-1" />
              Create your first entry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalSection;
