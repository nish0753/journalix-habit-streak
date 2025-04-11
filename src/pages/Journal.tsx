
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import JournalSection from '@/components/journal/JournalSection';
import { PenLine, Calendar, Tag, Filter, Search, Download, BookOpen, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

const Journal: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <Navbar activePage="journal" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Daily Journal</h1>
            <p className="text-muted-foreground">Reflect on your thoughts and experiences</p>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                  <PenLine size={18} />
                  <span>New Entry</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Create New Journal Entry</DialogTitle>
                </DialogHeader>
                {/* The dialog content will be rendered by JournalSection */}
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-purple-200 dark:border-purple-800">
              <Calendar size={18} />
              <span>View by Date</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-purple-200 dark:border-purple-800">
              <Tag size={18} />
              <span>Manage Tags</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-purple-200 dark:border-purple-800">
              <Filter size={18} />
              <span>Filter</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-purple-200 dark:border-purple-800">
              <Download size={18} />
              <span>Export</span>
            </Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-gray-800/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800 backdrop-blur-sm">
            <div className="relative w-full sm:w-64 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search entries..."
                className="pl-8 bg-transparent border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="date-desc">
                <SelectTrigger className="w-full sm:w-[180px] bg-transparent border-purple-200 dark:border-purple-800 focus:ring-purple-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="mood">By Mood</SelectItem>
                  <SelectItem value="tags">By Tags</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-purple-100 dark:bg-purple-900/30 rounded-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-transparent'}`}
                  onClick={() => setView('list')}
                >
                  <List size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${view === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-transparent'}`}
                  onClick={() => setView('grid')}
                >
                  <Grid size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <JournalSection />
            
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border border-purple-200 dark:border-purple-800 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Journal Writing" 
                    className="rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm w-full h-auto object-cover aspect-video hover:shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">The Power of Journaling</h3>
                  <p className="text-muted-foreground mb-4">
                    Regular journaling helps reduce stress, improve mood, and enhance self-awareness.
                    Taking just a few minutes each day to reflect can lead to significant mental health benefits.
                  </p>
                  <Tabs defaultValue="tips" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tips">Journaling Tips</TabsTrigger>
                      <TabsTrigger value="prompts">Journal Prompts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tips" className="mt-4 space-y-4">
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Write without censoring yourself</li>
                        <li>Try to journal at the same time each day</li>
                        <li>Don't worry about grammar or spelling</li>
                        <li>Be honest with yourself</li>
                        <li>Reflect on your entries periodically</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="prompts" className="mt-4 space-y-4">
                      <ul className="space-y-2 list-disc pl-5">
                        <li>What made you smile today?</li>
                        <li>What's something you're looking forward to?</li>
                        <li>Describe a challenge and how you're facing it</li>
                        <li>What are you grateful for today?</li>
                        <li>What would make today great?</li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
