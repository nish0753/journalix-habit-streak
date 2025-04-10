
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ProgressInsights from '@/components/insights/ProgressInsights';
import { Download, Share2, Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Insights: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div className="w-full md:w-64 flex-shrink-0 z-10">
        <Navbar activePage="insights" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Progress Insights</h1>
            <p className="text-muted-foreground">Visualize your progress and achievements</p>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Button className="flex items-center gap-2">
              <RefreshCw size={18} />
              <span>Refresh Data</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={18} />
              <span>Export</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 size={18} />
              <span>Share</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer size={18} />
              <span>Print</span>
            </Button>
          </div>
          
          <ProgressInsights />
        </div>
      </div>
    </div>
  );
};

export default Insights;
