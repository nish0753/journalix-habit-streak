
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import JournalSection from '@/components/journal/JournalSection';
import { PenLine, Calendar, Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Journal: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <Navbar activePage="journal" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Daily Journal</h1>
            <p className="text-muted-foreground">Reflect on your thoughts and experiences</p>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Button className="flex items-center gap-2">
              <PenLine size={18} />
              <span>New Entry</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar size={18} />
              <span>View by Date</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Tag size={18} />
              <span>Manage Tags</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              <span>Filter</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <JournalSection />
            
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Journal Writing" 
                    className="rounded-lg border border-border shadow-sm w-full h-auto object-cover aspect-video"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-semibold mb-4">The Power of Journaling</h3>
                  <p className="text-muted-foreground mb-4">
                    Regular journaling helps reduce stress, improve mood, and enhance self-awareness.
                    Taking just a few minutes each day to reflect can lead to significant mental health benefits.
                  </p>
                  <Button>Journaling Tips</Button>
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
