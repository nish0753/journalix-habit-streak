
import { supabase } from '@/lib/supabase';
import { JournalEntry } from '@/types';

export const fetchUserJournalEntries = async (userId: string, limit?: number): Promise<JournalEntry[]> => {
  let query = supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
    
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching journal entries:', error);
    throw new Error('Failed to fetch journal entries');
  }
  
  return data.map(entry => ({
    ...entry,
    id: entry.id,
    date: new Date(entry.date),
    tags: entry.tags || []
  }));
};

export const createJournalEntry = async (
  entry: Omit<JournalEntry, 'id'> & { userId: string }
): Promise<JournalEntry> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      content: entry.content,
      date: entry.date.toISOString(),
      mood: entry.mood,
      tags: entry.tags,
      user_id: entry.userId
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating journal entry:', error);
    throw new Error('Failed to create journal entry');
  }
  
  return {
    ...data,
    id: data.id,
    date: new Date(data.date),
    tags: data.tags || []
  };
};

export const updateJournalEntry = async (
  entry: Partial<JournalEntry> & { id: string }
): Promise<JournalEntry> => {
  const updates: any = { ...entry };
  
  // Convert Date to ISO string for the database
  if (updates.date) {
    updates.date = updates.date.toISOString();
  }
  
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entry.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating journal entry:', error);
    throw new Error('Failed to update journal entry');
  }
  
  return {
    ...data,
    date: new Date(data.date),
    tags: data.tags || []
  };
};

export const deleteJournalEntry = async (entryId: string): Promise<void> => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);
    
  if (error) {
    console.error('Error deleting journal entry:', error);
    throw new Error('Failed to delete journal entry');
  }
};

export const exportJournalEntriesAsPDF = async (userId: string): Promise<Blob> => {
  // This function would typically call a serverless function to generate a PDF
  // For now, we'll implement a client-side solution
  const entries = await fetchUserJournalEntries(userId);
  
  // This is a placeholder. In a real implementation, you would:
  // 1. Use a PDF generation library like jsPDF
  // 2. Format the entries nicely
  // 3. Return the generated PDF as a Blob
  
  // Simple example of how this might be structured with jsPDF:
  /*
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text('Journal Entries', 20, 20);
  
  let yPos = 40;
  
  entries.forEach(entry => {
    const formattedDate = entry.date.toLocaleDateString();
    
    doc.setFontSize(14);
    doc.text(`Date: ${formattedDate}`, 20, yPos);
    yPos += 10;
    
    if (entry.mood) {
      doc.text(`Mood: ${entry.mood}`, 20, yPos);
      yPos += 10;
    }
    
    doc.setFontSize(12);
    const contentLines = doc.splitTextToSize(entry.content, 180);
    doc.text(contentLines, 20, yPos);
    yPos += contentLines.length * 7 + 15;
    
    // Add page if needed
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  return doc.output('blob');
  */
  
  // For now, return a text blob as a placeholder
  const entriesText = entries.map(entry => 
    `Date: ${entry.date.toLocaleDateString()}\nMood: ${entry.mood || 'Not specified'}\n\n${entry.content}\n\n---\n\n`
  ).join('');
  
  return new Blob([entriesText], { type: 'text/plain' });
};
